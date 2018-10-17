package ozone.security.session;

import org.ehcache.Cache;
import org.ehcache.event.CacheEvent;
import org.ehcache.event.EventFiring;
import org.ehcache.event.EventOrdering;
import org.ehcache.event.EventType;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.session.HttpSessionDestroyedEvent;
import org.springframework.util.Assert;

import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.function.BiFunction;


/**
 * This class is based on the example code posted at
 * http://scalejava.blogspot.com/2012/12/clustered-spring-sessionregistry.html.
 *
 * It implements the spring SessionRegistry in a way that can be clustered
 * using ehcache
 */
public class ClusteredSessionRegistryImpl
        implements SessionRegistry, ApplicationListener<SessionDestroyedEvent>
{

	private final Cache<String, SessionInformation> sessionCache;

    /**
     * Implements the event listening needed to reattach a ClusteredSessionInformation
     * to this SessionRegistry.
     *
     * Unfortunately, the ehcache API requires us to implement a bunch of extra functions
     * for listening to other events that we aren't interested in
     */
    public ClusteredSessionRegistryImpl(OzoneCacheManager ozoneCacheManager) {
        this.sessionCache = ozoneCacheManager.getSessionCache();

        this.sessionCache.getRuntimeConfiguration().registerCacheEventListener(
                this::onCacheEvent,
                EventOrdering.ORDERED,
                EventFiring.ASYNCHRONOUS,
                EnumSet.of(EventType.CREATED, EventType.UPDATED));
    }

    /**
     * Set the sessionregistry on the newly added element.  For elements created
     * by this node, this should have no effect.  For element received from other
     * cluster nodes, this sets the registry to allow changes to be sent back
     */
    private void onCacheEvent(CacheEvent event) {
        ClusteredSessionInformation info = (ClusteredSessionInformation) event.getNewValue();

        if (info.hasSessionRegistry()) return;

        info.setSessionRegistry(this);
    }

	@Override
	public void onApplicationEvent(SessionDestroyedEvent event) {
        if (!(event instanceof HttpSessionDestroyedEvent)) return;

        String sessionId = ((HttpSession) event.getSource()).getId();
        removeSessionInformation(sessionId);
    }

	@Override
	public List<Object> getAllPrincipals() {
        Set<Object> principals = mapResultsToSet(sessionCache, (key, info) -> info.getPrincipal());

        return new ArrayList<>(principals);
	}

	@Override
	public List<SessionInformation> getAllSessions(final Object principal, boolean includeExpiredSessions) {
        return mapResultsToList(sessionCache, (key, info) -> {
            if (!info.getPrincipal().equals(principal)) return null;
            if (!includeExpiredSessions && info.isExpired()) return null;

            return info;
        });
	}
	
	@Override
	public SessionInformation getSessionInformation(String sessionId) {
		Assert.hasText(sessionId, "SessionId required as per interface contract");

        return sessionCache.get(sessionId);
    }
	
	@Override
	public void refreshLastRequest(String sessionId) {
        SessionInformation info = getSessionInformation(sessionId);
        if (info != null) {
            info.refreshLastRequest();
        }
	}
	
	@Override
	public void registerNewSession(String sessionId, Object principal) {
		Assert.hasText(sessionId, "SessionId required as per interface contract");
		Assert.notNull(principal, "Principal required as per interface contract");

		if (getSessionInformation(sessionId) != null) {
			removeSessionInformation(sessionId);
		}
		
        putSessionInformation(new ClusteredSessionInformation(principal, sessionId, new Date(), this));
	}

	@Override
	public void removeSessionInformation(String sessionId) {
		Assert.hasText(sessionId, "SessionId required as per interface contract");

        sessionCache.remove(sessionId);
	}

    /**
     * @return a new Set containing all non-null values returned by {@code mapper}
     */
    private static <K, V, R> Set<R> mapResultsToSet(Cache<K, V> cache, BiFunction<K, V, R> mapper) {
        Set<R> results = new HashSet<>();
        for (Cache.Entry<K, V> entry : cache) {
            V value = entry.getValue();
            if (value != null) {
                R result = mapper.apply(entry.getKey(), value);
                if (result != null) {
                    results.add(result);
                }
            }
        }
        return results;
    }

    /**
     * @return a new List containing all non-null values returned by {@code mapper}
     */
    private static <K, V, R> List<R> mapResultsToList(Cache<K, V> cache, BiFunction<K, V, R> mapper) {
        List<R> results = new ArrayList<>();
        for (Cache.Entry<K, V> entry : cache) {
            V value = entry.getValue();
            if (value != null) {
                R result = mapper.apply(entry.getKey(), value);
                if (result != null) {
                    results.add(result);
                }
            }
        }
        return results;
    }

    private void putSessionInformation(SessionInformation info) {
		sessionCache.put(info.getSessionId(), info);
    }

    /**
     * Used to save updates to the session information to the cache.
     * @param info A SessionInformation object describing a session which
     * is already stored in the cache.  The old SessionInformation in the cache
     * will be replaced with this one.
     *
     * @throws IllegalArgumentException if the passed-in info does not 
     * describe a session that is already present
     */
    private void updateSessionInformation(SessionInformation info) {
        SessionInformation oldInfo = getSessionInformation(info.getSessionId());

        if (oldInfo == null) {
            throw new IllegalArgumentException();
        }

        putSessionInformation(info);
    }

    /**
     * An extension of the SessionInformation class that pushes changes to itself
     * back to the cache so that they show up throughout the cluster
     */
    private static class ClusteredSessionInformation extends SessionInformation {

        /**
         * The containing instance.  This is done as an explicit variable, instead
         * of making this class non-static, because it needs to handle serialization.
         */
        private transient ClusteredSessionRegistryImpl sessionRegistry;

        ClusteredSessionInformation(Object principal, String sessionId, Date lastRequest,
                                    ClusteredSessionRegistryImpl sessionRegistry) {

            super(principal, sessionId, lastRequest);
            setSessionRegistry(sessionRegistry);
        }

        @Override
        public void refreshLastRequest() {
            super.refreshLastRequest();
            sessionRegistry.updateSessionInformation(this);
        }

        @Override
        public void expireNow() {
            super.expireNow();
            sessionRegistry.updateSessionInformation(this);
        }

        void setSessionRegistry(ClusteredSessionRegistryImpl sessionRegistry) {
            this.sessionRegistry = sessionRegistry;
        }

        boolean hasSessionRegistry() {
            return sessionRegistry != null;
        }

    }

}

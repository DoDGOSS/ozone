package ozone.security.session;

import org.ehcache.Cache;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;

import java.util.List;


/**
 * Subclass of ConcurrentSessionControlStrategy that is more robust than the default implementation.
 * <p>
 * Overrides allowableSessionsExceeded to better handle to case where more than one too many
 * sessions has been created (which appears to happen as a result of some sort of race condition).
 */
public class OzoneConcurrentSessionControlStrategy
        extends ConcurrentSessionControlAuthenticationStrategy
{

    /**
     * Only storing a single value in the cache, so the key doesn't really matter,
     * but it needs to be something.
     */
    private static final String CACHE_KEY = "ALLOWED_SESSIONS";


    /**
     * Using ehcache to propogate changes to the number of allowed sessions across
     * cluster nodes.  This cache should only ever have one value in it
     */
    private final Cache<String, Integer> allowedSessionsCache;

    private boolean exceptionIfMaximumExceeded = false;

    public OzoneConcurrentSessionControlStrategy(SessionRegistry sessionRegistry,
                                                 OzoneCacheManager ozoneCacheManager) {
        super(sessionRegistry);
        this.allowedSessionsCache = ozoneCacheManager.getAllowedSessionsCache();
    }

    public void setExceptionIfMaximumExceeded(boolean exceptionIfMaximumExceeded) {
        this.exceptionIfMaximumExceeded = exceptionIfMaximumExceeded;
        super.setExceptionIfMaximumExceeded(exceptionIfMaximumExceeded);
    }

    /**
     * Stores the maximum sessions value in the cache so that it can be picked up
     * by all nodes in the cluster
     */
    public void setMaximumSessions(int maxSessions) {
        allowedSessionsCache.put(CACHE_KEY, maxSessions);
    }

    /**
     * @return the max sessions value that is stored in the cache
     */
    public int getMaximumSessionsForThisUser(Authentication authentication) {
        return allowedSessionsCache.get(CACHE_KEY);
    }

    /**
     * This method has been copied from ConcurrentSessionControlStrategy and modified to
     * better ensure that more that the allowed number of sessions are never valid
     * at the same time.
     */
    @Override
    protected void allowableSessionsExceeded(List<SessionInformation> sessions,
                                             int allowableSessions,
                                             SessionRegistry registry) throws SessionAuthenticationException
    {
        if (exceptionIfMaximumExceeded || (sessions == null)) {
            String message = messages.getMessage(
                    "ConcurrentSessionControlStrategy.exceededAllowed",
                    new Object[]{allowableSessions},
                    "Maximum sessions of {0} for this principal exceeded");

            throw new SessionAuthenticationException(message);
        }

        //sort the session by recency, increasing
        sessions.sort(OzoneConcurrentSessionControlStrategy::compareSessionByLastRequestTime);

        //note - sessions does not include the new session being authenticated
        int sessionsToExpire = sessions.size() - allowableSessions + 1;

        //remove the first sessionToExpire sessions from the sorted list
        for (int i = 0; i < sessionsToExpire; i++) {
            sessions.get(i).expireNow();
        }
    }

    private static int compareSessionByLastRequestTime(SessionInformation session1, SessionInformation session2) {
        return session1.getLastRequest().compareTo(session2.getLastRequest());
    }

}

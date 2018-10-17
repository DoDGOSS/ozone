package ozone.security.session;

import org.ehcache.Cache;
import org.springframework.security.core.session.SessionInformation;


public interface OzoneCacheManager {

    Cache<String, SessionInformation> getSessionCache();

    Cache<String, Integer> getAllowedSessionsCache();

}

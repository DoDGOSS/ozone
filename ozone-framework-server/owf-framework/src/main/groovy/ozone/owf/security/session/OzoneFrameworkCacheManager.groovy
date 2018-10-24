package ozone.owf.security.session

import grails.plugin.cache.ehcache.GrailsEhcacheCache
import org.grails.plugin.cache.GrailsCacheManager

import org.springframework.security.core.session.SessionInformation

import org.springframework.cache.Cache as SpringCache

import org.ehcache.Cache

import ozone.security.session.OzoneCacheManager


class OzoneFrameworkCacheManager implements OzoneCacheManager {

    GrailsCacheManager grailsCacheManager

    @Override
    Cache<String, SessionInformation> getSessionCache() {
        SpringCache cache = grailsCacheManager.getCache("sessionCache")

        return cache instanceof GrailsEhcacheCache ? cache.getNativeCache() : null
    }

    @Override
    Cache<String, Integer> getAllowedSessionsCache() {
        SpringCache cache = grailsCacheManager.getCache("allowedSessionsCache")

        return cache instanceof GrailsEhcacheCache ? cache.getNativeCache() : null
    }
}

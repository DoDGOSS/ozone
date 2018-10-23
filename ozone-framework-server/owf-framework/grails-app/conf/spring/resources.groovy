import grails.util.Environment

import org.springframework.security.web.FilterChainProxy

import custom.access.CustomAccessChecker

import ozone.owf.cache.OwfMessageCache
import ozone.owf.devel.DefaultDataLoader
import ozone.owf.devel.DevelopmentDataLoader
import ozone.owf.grails.OwfExceptionResolver
import ozone.owf.security.AutoUserSessionProvider
import ozone.owf.security.UserSessionProvider
import org.ozoneplatform.auditing.AuditLogListener

final String APPLICATION_CONTEXT_PROD = 'classpath:ozone/framework/application.xml'
final String APPLICATION_CONTEXT_DEV = 'classpath:ozone/framework/application-dev.xml'

beans = {

    xmlns context: 'http://www.springframework.org/schema/context'
    context.'component-scan'('base-package': 'ozone.owf.util')

    if (Environment.current == Environment.PRODUCTION) {
        println "Loading 'production' bean context: $APPLICATION_CONTEXT_PROD"
        importBeans(APPLICATION_CONTEXT_PROD)
    } else {
        println "Loading 'development' bean context: $APPLICATION_CONTEXT_DEV"
        importBeans(APPLICATION_CONTEXT_DEV)
    }

    auditLogListener(AuditLogListener) {
        sessionFactory = ref('sessionFactory')
        accountService = ref('accountService')
        owfApplicationConfigurationService = ref('owfApplicationConfigurationService')
        grailsApplication = ref('grailsApplication')
    }

    owfMessageCache(OwfMessageCache) {}

    defaultDataLoader(DefaultDataLoader) { it.autowire = 'byType' }

    developmentDataLoader(DevelopmentDataLoader) { it.autowire = 'byType' }

    // wire up a different account service if -Duser=something and environment is development
    if (isDevelopment() || isTest()) {
        springSecurityFilterChain(FilterChainProxy, [])

        def userName = System.properties.getProperty('user', 'testUser1')
        println("Using AutoUserSessionProvider - you will be logged in as '$userName'")

        userSessionProvider(AutoUserSessionProvider) {
            autoUserName = userName
        }
    }
    else {
        userSessionProvider(UserSessionProvider)
    }

    customAccessChecker(CustomAccessChecker) {}

    exceptionHandler(OwfExceptionResolver) {
        exceptionMappings = ['java.lang.Exception': '/error']
    }

}

static boolean isProduction() {
    Environment.current == Environment.PRODUCTION
}

static boolean isDevelopment() {
    Environment.current == Environment.DEVELOPMENT
}

static boolean isTest() {
    Environment.current == Environment.TEST
}

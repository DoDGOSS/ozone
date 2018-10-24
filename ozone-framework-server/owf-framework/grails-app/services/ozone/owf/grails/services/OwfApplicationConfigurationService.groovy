package ozone.owf.grails.services

import grails.core.GrailsApplication
import grails.util.GrailsUtil

import org.springframework.beans.factory.NoSuchBeanDefinitionException
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy
import org.springframework.transaction.annotation.Transactional

import org.quartz.Scheduler

import ozone.owf.enums.OwfApplicationSetting
import ozone.owf.grails.jobs.DisableInactiveAccountsJob
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.service.impl.ApplicationConfigurationServiceImpl


class OwfApplicationConfigurationService extends ApplicationConfigurationServiceImpl {

    GrailsApplication grailsApplication

    Scheduler quartzScheduler

    /** Spring Security bean responsible for handling the max number of sessions. */
    ConcurrentSessionControlAuthenticationStrategy concurrentSessionControlAuthenticationStrategy

    @Override
    @Transactional(readOnly=false)
    public ApplicationConfiguration saveApplicationConfiguration(ApplicationConfiguration item){
        item = super.saveApplicationConfiguration(item)
        // OP-727 Disabling inactive user accounts
        if (item.code == OwfApplicationSetting.DISABLE_INACTIVE_ACCOUNTS.code) {
            handleDisableInactiveAccountsJobChange(item)
        }

        handleSessionControlChange(item)

        item
	}

    // Implements validations specific to OWF
    public void validateApplicationConfiguration(def applicationConfiguration){
        if(!applicationConfiguration)
            return

        if(applicationConfiguration.code in [OwfApplicationSetting.SESSION_CONTROL_MAX_CONCURRENT, OwfApplicationSetting.INACTIVITY_THRESHOLD]*.code) {
            def value = applicationConfiguration.value?.isInteger() ? applicationConfiguration.value.toInteger() : -1
            if(value < 1) {
                applicationConfiguration.errors.rejectValue('value', "application.configuration.invalid.number.required.gt.zero")
                return
            }
        }

        if(applicationConfiguration.code == OwfApplicationSetting.CUSTOM_HEADER_HEIGHT.code || applicationConfiguration.code == OwfApplicationSetting.CUSTOM_FOOTER_HEIGHT.code) {
            def value = Integer.valueOf(applicationConfiguration.value)
            if(value > 150) {
                applicationConfiguration.errors.rejectValue('value', "application.configuration.custom.headerfooter.height.exceeds.max")
            }
            return
        }

        if(applicationConfiguration.code == OwfApplicationSetting.SECURITY_LEVEL.code) {
            def value = applicationConfiguration.value
            def validator
            try {
                validator = grailsApplication.mainContext.getBean("securityLevelValidator")
            } catch(NoSuchBeanDefinitionException nbe) {
                log.debug("No security level validation bean found: The security level will not be validated")
            }

            if(validator && !validator.validate(value)) {
                applicationConfiguration.errors.rejectValue('value', "application.configuration.owf.security.level.invalid")
                return
            }
        }

        super.validate(applicationConfiguration)
    }
	
    /**
     * helper method for handleSessionControlChange. Ths is the method that actuall updates the
     * property in spring security
     * @param maxSessions The value to be set as the maximumSessions on the spring 
     * ConcurrentSessionControlStrategy
     */
    private updateMaxSessions(int maxSessions) {
        log.debug "Updating max sessions per user to ${maxSessions}"
        log.debug "Session Control Strategy Bean: ${concurrentSessionControlAuthenticationStrategy}"

        if (!concurrentSessionControlAuthenticationStrategy) {
            throw new IllegalStateException("Attempted to update session control configuration when session control bean is not present")
        }

        concurrentSessionControlAuthenticationStrategy.maximumSessions = maxSessions
    }

    /**
     * @return the currently-stored value of the SESSION_CONTROL_ENABLED configuration
     */
    private boolean getSessionControlEnabled() {
        getApplicationConfiguration(OwfApplicationSetting.SESSION_CONTROL_ENABLED).value.toBoolean()
    }

    /**
     * @return the currently-stored value of the SESSION_CONTROL_MAX_CONCURRENT configuration
     */
    private int getSessionControlMax() {
        getApplicationConfiguration(OwfApplicationSetting.SESSION_CONTROL_MAX_CONCURRENT).value.toInteger()
    }

    /**
     * Updates the spring security ConcurrentSessionControlStrategy to accept the configured
     * number of concurrent sessions per user.
     * @param item The configuration that was just changed.  If null, this method ensures
     * that the ConcurrentSessionControlStrategy is updated with the current configurations
     * from the database.  If not a SESSION_CONTROL configuration, this method does nothing
     */
    private handleSessionControlChange(ApplicationConfiguration item) {
        final DISABLED_SETTING = -1 //this value tells spring not to limit sessions

        try {
            //if nothing is passed in, just update spring from the database
            if (!item) {
                updateMaxSessions(getSessionControlEnabled() ? getSessionControlMax() : 
                    DISABLED_SETTING) 
            }
            //check to see if item is a session control configuration and handle appropriately
            else if (item.code == OwfApplicationSetting.SESSION_CONTROL_ENABLED.code) {
                updateMaxSessions(item.value.toBoolean() ? getSessionControlMax() : 
                    DISABLED_SETTING)
            }
            else if (item.code == OwfApplicationSetting.SESSION_CONTROL_MAX_CONCURRENT.code) {
                if (getSessionControlEnabled()) {
                    updateMaxSessions(item.value.toInteger())
                }
            }
            //default - some other type of configuration, do nothing
        }
        catch (NumberFormatException e) {
            log.error "Invalid Session Control configuration: ${e.message}"
        }
    }

	@Transactional(readOnly=false)
	void createRequired(){

        try {
            //update spring security
            handleSessionControlChange()
        }
        catch (IllegalStateException e) {
            if (GrailsUtil.environment == 'production') {
                log.error "Unable to initialize session management: ${e.message}"
            }
            //this is expected in dev mode, since spring security is not set up
        }

        handleDisableInactiveAccountsJobChange(this.getApplicationConfiguration(OwfApplicationSetting.DISABLE_INACTIVE_ACCOUNTS))
	}

    @Transactional(readOnly = true)
    def checkThatConfigsExist() {
        log.info "Doing configuration validation"
        OwfApplicationSetting.values().each { setting ->
            def requiredConfig = getApplicationConfiguration(setting)
            if(!requiredConfig) {
                throw new IllegalStateException("The required configuration, ${setting.code}, is missing from the " +
                        "database. Please repair the application configuration table.")
            }
        }
    }

	def handleDisableInactiveAccountsJobChange(ApplicationConfiguration configItem) {
        log.info "Doing disableInactiveAccountsJob change"
        def job = new DisableInactiveAccountsJob(getApplicationConfiguration(OwfApplicationSetting.JOB_DISABLE_ACCOUNTS_INTERVAL).value,
                getApplicationConfiguration(OwfApplicationSetting.JOB_DISABLE_ACCOUNTS_START).value)

        // Schedule the disable job if turned on, otherwise cancel the job  
        if (configItem) {
            if (configItem.value.toBoolean()) {
                job.schedule(quartzScheduler)
            }
            else {
                job.cancel(quartzScheduler)
            }    
        }
    }

    @Transactional (readOnly = true)
    public String getApplicationSecurityLevel() {
        return this.valueOf(OwfApplicationSetting.SECURITY_LEVEL) ?: ""
    }
}

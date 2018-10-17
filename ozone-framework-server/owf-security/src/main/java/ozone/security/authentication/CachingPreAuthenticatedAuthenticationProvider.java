package ozone.security.authentication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.security.authentication.AccountStatusUserDetailsChecker;

import org.springframework.util.Assert;

public class CachingPreAuthenticatedAuthenticationProvider
    extends PreAuthenticatedAuthenticationProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(CachingPreAuthenticatedAuthenticationProvider.class);

    private UserCache userCache;

    //The following three variables had to be copied out of the parent class, along with
    //their setters, because they were private and had no getters
    private AuthenticationUserDetailsService preAuthenticatedUserDetailsService = null;
    private UserDetailsChecker userDetailsChecker = new AccountStatusUserDetailsChecker();
    private boolean throwExceptionWhenTokenRejected = false;

    public UserCache getUserCache() {
        return userCache;
    }

    public void setUserCache(UserCache userCache) {
        this.userCache = userCache;
    }

    /*
     * This method copied from the superclass and modified slightly
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!supports(authentication.getClass())) {
            return null;
        }

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("PreAuthenticated authentication request: " + authentication);
        }

        if (authentication.getPrincipal() == null) {
            LOGGER.debug("No pre-authenticated principal found in request.");

            if (throwExceptionWhenTokenRejected) {
                throw new BadCredentialsException("No pre-authenticated principal found in request.");
            }
            return null;
        }

        if (authentication.getCredentials() == null) {
            LOGGER.debug("No pre-authenticated credentials found in request.");

            if (throwExceptionWhenTokenRejected) {
                throw new BadCredentialsException("No pre-authenticated credentials found in request.");
            }
            return null;
        }

        /*
         * This cache check is the customized part of the method
         */
        UserDetails ud = null;
        if (userCache != null) {
            ud = userCache.getUserFromCache(authentication.getName());
        }

        if (ud == null) {
            ud = preAuthenticatedUserDetailsService.loadUserDetails(authentication);
        }
        else {
            LOGGER.debug("User found in cache: " + authentication.getName());
        }

        userDetailsChecker.check(ud);

        PreAuthenticatedAuthenticationToken result =
            new PreAuthenticatedAuthenticationToken(ud, authentication.getCredentials(), ud.getAuthorities());
        result.setDetails(authentication.getDetails());

        /*
         * Store userDetails in cache
         */
        if (userCache != null) {
            userCache.putUserInCache(ud);
        }

        return result;
    }

    @Override
    public void setPreAuthenticatedUserDetailsService(AuthenticationUserDetailsService aPreAuthenticatedUserDetailsService) {
        this.preAuthenticatedUserDetailsService = aPreAuthenticatedUserDetailsService;
        super.setPreAuthenticatedUserDetailsService(aPreAuthenticatedUserDetailsService);
    }

    @Override
    public void setThrowExceptionWhenTokenRejected(boolean throwExceptionWhenTokenRejected) {
        this.throwExceptionWhenTokenRejected = throwExceptionWhenTokenRejected;
        super.setThrowExceptionWhenTokenRejected(throwExceptionWhenTokenRejected);
    }


    @Override
    public void setUserDetailsChecker(UserDetailsChecker userDetailsChecker) {
        Assert.notNull(userDetailsChecker, "userDetailsChacker cannot be null");
        this.userDetailsChecker = userDetailsChecker;
        super.setUserDetailsChecker(userDetailsChecker);
    }
}

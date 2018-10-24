package ozone.securitysample.authentication.basic;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.model.GrantedAuthorityImpl;
import ozone.security.authorization.target.OwfGroup;

/**
 * An implementation of a DetailsService that should only be used for testing.
 * This class returns a valid user details object for any username that is
 * passed to the loadUserByUsername method. If the username contains the substring
 * "Admin", the user will be granted the admin role. The use case for this
 * implementation is to provide a minimally functional provider that at the same
 * time can scale to a large number of users for performance testing scenarios
 * where security is not a concern.
 */
public class PerfTestingDetailsService implements UserDetailsService {

    public UserDetails loadUserByUsername(String username) {
        Collection<OwfGroup> owfGroups = new ArrayList<>();
        OWFUserDetailsImpl owfUser = new OWFUserDetailsImpl(username, "password", getAuthorities(username), owfGroups);
        owfUser.setDisplayName(username);
        owfUser.setEmail(username + "@ozonePerfTesting.org");
        owfUser.setOrganization(username + " organization");

        return owfUser;
    }

    protected Collection<GrantedAuthority> getAuthorities(String username) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new GrantedAuthorityImpl("ROLE_USER"));
        if(username.contains("Admin")) {
            authorities.add(new GrantedAuthorityImpl("ROLE_ADMIN"));
        }
        if(username.contains("Org")) {
            authorities.add(new GrantedAuthorityImpl("ROLE_ORG_STEWARD"));
        }

        return authorities;
    }
}

package ozone.securitysample.authentication.basic;

import org.hamcrest.core.IsInstanceOf;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.userdetails.UserDetails;
import ozone.security.authorization.model.GrantedAuthorityImpl;
import ozone.security.authentication.OWFUserDetailsImpl;
import org.springframework.security.core.GrantedAuthority;

import java.util.HashSet;

public class PerfTestingDetailsServiceTest {
    private PerfTestingDetailsService detailsService;
    private final GrantedAuthority userRole = new GrantedAuthorityImpl("ROLE_USER");
    private final GrantedAuthority adminRole = new GrantedAuthorityImpl("ROLE_ADMIN");
    private HashSet<GrantedAuthority> userAuthorities;
    private HashSet<GrantedAuthority> adminAuthorities;

    @Before
    public void setUp() {
        detailsService = new PerfTestingDetailsService();

        userAuthorities = new HashSet<GrantedAuthority>();
        userAuthorities.add(userRole);

        adminAuthorities = new HashSet<GrantedAuthority>();
        adminAuthorities.add(adminRole);
        adminAuthorities.add(userRole);
    }

    @Test
    public void testGetAuthoritiesForUser() {
        HashSet<GrantedAuthority> actualAuthorities = new HashSet<GrantedAuthority>(detailsService.getAuthorities("user"));
        assertEquals(actualAuthorities, userAuthorities);
    }

    @Test
    public void testGetAuthoritiesForAdmin() {
        HashSet<GrantedAuthority> actualAuthorities = new HashSet<GrantedAuthority>(detailsService.getAuthorities("userAdmin"));
        assertEquals(actualAuthorities, adminAuthorities);
    }

    public void testLoadUserByUsername() {
        String username = "someUser";
        UserDetails details = detailsService.loadUserByUsername(username);
        OWFUserDetailsImpl owfDetails;

        assertTrue(new IsInstanceOf(OWFUserDetailsImpl.class).matches(details));
        owfDetails = (OWFUserDetailsImpl) details;
        assertEquals(username, owfDetails.getDisplayName());
        assertEquals(username + "@ozonePerfTesting.org", owfDetails.getEmail());
        assertEquals(username + " organization", owfDetails.getOrganization());

    }
}

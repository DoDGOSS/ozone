package ozone.securitysample.authentication.ldap;

import java.util.Collection;

import java.text.MessageFormat;

import javax.naming.directory.Attributes;
import javax.naming.NamingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.support.LdapEncoder;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.model.OwfGroupImpl;
import ozone.security.authorization.target.OwfGroup;

/**
 * Context mapper to convert to a user details object. Includes code to fetch OWF groups from the database.
 */
public class OWFUserDetailsContextMapper implements UserDetailsContextMapper {

	private static final Logger LOGGER = LoggerFactory.getLogger(OWFUserDetailsContextMapper.class);

    private LdapContextSource contextSource;
    private LdapTemplate ldapTemplate;
    private String searchBase;
    private String filter;

    public OWFUserDetailsContextMapper(LdapContextSource contextSource, String searchBase, String filter) {
        this.ldapTemplate = new LdapTemplate(contextSource);
        this.contextSource = contextSource;
        this.searchBase = searchBase;
        this.filter = filter;
    }

    /**
	 * Main overridden function, maps specific fields from the context object to
	 * the user details object.
	 *
	 * @param ctx - directory context
     * @param username - The username
     * @param authority - Authorities that this user has been determined to have
	 * @return userDetails object
	 */
    @Override
	public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authority) {
        Collection<OwfGroup> groups = determineOwfGroups(ctx.getDn().toString());

        OWFUserDetailsImpl userDetails = new OWFUserDetailsImpl(
                ctx.getStringAttribute("cn"),
                ctx.getObjectAttribute("userpassword").toString(),
                authority,
                groups);

        userDetails.setDisplayName(ctx.getStringAttribute("givenname"));
        userDetails.setEmail(ctx.getStringAttribute("mail"));

        LOGGER.debug("user details [" + userDetails.toString() + "].");

		return userDetails;
	}

    @Override
    public void mapUserToContext(UserDetails user, DirContextAdapter ctx) {
        throw new UnsupportedOperationException("This plugin does not support the saving of user attributes");
    }

	/**
	 * Determine owf groups from the list of groups. Translates into OwfGroup objects
	 */
    private Collection<OwfGroup> determineOwfGroups(final String userDn) {
        return ldapTemplate.search(
                searchBase,
                createFilterForUserDN(userDn),
                OWFUserDetailsContextMapper::mapGroupFromCN);
	}

	private String createFilterForUserDN(String userDn) {
        String userFilter = String.format("%s,%s", userDn, contextSource.getBaseLdapPath().toString());

        return MessageFormat.format(filter, LdapEncoder.filterEncode(userFilter));
    }

    private static OwfGroup mapGroupFromCN(Attributes attrs) throws NamingException {
        return new OwfGroupImpl((String) attrs.get("cn").get(), null, null, true);
    }

}

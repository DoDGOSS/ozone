package ozone.security.authorization.target;

/**
 * WidgetGroup
 * 
 *  This interface describes a single OWF user group.  A group is a way of collecting
 *  OWF users and being able to assign widgets and other behaviors to them collectively. 
 *  
 *  A group has one attribute, a name.  
 *  
 *  Consider this similar to GrantedAuthorities.  
 *
 */
public interface OwfGroup {

	/**
	 * 
	 * @return the name of the Owf Group
	 */
	public String getOwfGroupName();


    /**
	 *
	 * @return a drescription of the OWF group
	 */
	public String getOwfGroupDescription();


     /**
	 *
	 * @return an email address that will reach someone if there are problems with the group.
	 * This is displayed to a group administrator in OWF
	 */
	public String getOwfGroupEmail();

	
	/**
	 * @return true if this is an active group
	 */
	public boolean isActive();

}

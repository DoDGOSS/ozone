package org.ozoneplatform.auditing.hibernate

import org.apache.log4j.Logger
import org.hibernate.FlushMode
import org.hibernate.Session
import org.hibernate.SessionFactory
import org.hibernate.event.service.spi.EventListenerRegistry
import org.hibernate.event.spi.*
import org.hibernate.event.spi.LoadEventListener.LoadType
import org.hibernate.internal.SessionFactoryImpl
import org.hibernate.type.BinaryType
import org.hibernate.type.CollectionType
import org.hibernate.type.Type
import org.ozoneplatform.auditing.enums.EventTypes
import org.ozoneplatform.auditing.enums.PayloadType
import org.ozoneplatform.auditing.format.cef.CEF
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.format.cef.factory.CEFFactory
import org.ozoneplatform.auditing.format.cef.factory.ExtensionFactory

import javax.servlet.http.HttpServletRequest

abstract class AbstractAuditLogListener implements PostDeleteEventListener, PostInsertEventListener, PostUpdateEventListener, LoadEventListener {

	private static final Logger log = Logger.getLogger(AbstractAuditLogListener)
	
	protected SessionFactory sessionFactory
	
	private static final def FIELDS_TO_IGNORE = ['editedDate','editedBy','createdDate','createdBy','version']

    void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory

        registerSelfWithListeners([
            EventType.POST_DELETE,
            EventType.POST_INSERT,
            EventType.POST_UPDATE,
            EventType.LOAD
        ])
    }

    protected void registerSelfWithListeners(Collection<EventType<?>> types) {
        getEventListenerRegistry()
            .orElseThrow({-> new RuntimeException ("Unable to get EventListenerRegistry")})
            .with { registry -> types.each { registry.getEventListenerGroup(it).appendListener(this) } }
    }

    private Optional<EventListenerRegistry> getEventListenerRegistry() {
        getHibernateSessionFactory()
                .flatMap { Optional.ofNullable(it.serviceRegistry) }
                .flatMap { Optional.ofNullable(it.getService(EventListenerRegistry)) }
    }

    private Optional<SessionFactoryImpl> getHibernateSessionFactory() {
        if (!(sessionFactory instanceof SessionFactoryImpl)) {
            log.warn("Unknown SessionFactory implementation: ${sessionFactory.class.canonicalName}")
            return Optional.empty()
        }

        Optional.ofNullable((SessionFactoryImpl) sessionFactory)
    }

    @Override
    public void onLoad(LoadEvent event, LoadType type) {

        if(type != LoadEventListener.GET)
            return;

        String entityClassName = event.entityClassName ?: ""
		
        if(!isAccessAuditable(entityClassName))
            return
		
		FlushMode mode = sessionFactory.getCurrentSession().getFlushMode()
		setFlushModeToManual()
			
		try{
			if(doCefLogging() && doCefObjectAccessLogging()){
								
				CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.OBJ_ACCESS.getDescription(),
						"Object was accessed", 7)
				def fields = ExtensionFactory.getBaseExtensionFields(getRequest(), getUserName(),
						getApplicationVersion(), getHostClassification())
	
				fields[Extension.EVENT_TYPE] 	= EventTypes.OBJ_ACCESS.getDescription()
				fields[Extension.PAYLOAD] 		= event.entityClassName
				fields[Extension.PAYLOAD_CLS]	= getHostClassification()
				fields[Extension.PAYLOAD_ID] 	= event.entityId
				fields[Extension.PAYLOAD_SIZE] 	= Extension.UNKOWN_NUMBER_VALUE
				fields[Extension.PAYLOAD_TYPE] 	= PayloadType.OBJECT.getDescription()
	
				cef.extension = new Extension(fields)
	
				log.info cef.toString()
			}
		}finally {
			this.resetFlushMode(mode)
		}		

		
	}
	
	
	@Override
	public void onPostUpdate(PostUpdateEvent event) {

		FlushMode mode = sessionFactory.getCurrentSession().getFlushMode()
		setFlushModeToManual()
		
		try{
			if(doCefLogging()){
				CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.OBJ_MODIFY.getDescription(),
					"Object was updated", 7)
				def fields = ExtensionFactory.getBaseExtensionFields(getRequest(), getUserName(),
					getApplicationVersion(), getHostClassification())
				
				
				def newPropMap = getNewPropertyValueMap(event)
				fields[Extension.EVENT_TYPE] 		= EventTypes.OBJ_MODIFY.getDescription()
				fields[Extension.PAYLOAD] 			= newPropMap?.toMapString()
				fields[Extension.PAYLOAD_CLS]		= getHostClassification()
				fields[Extension.PAYLOAD_ID] 		= event.getEntity().getId()
				fields[Extension.PAYLOAD_SIZE] 		= newPropMap != null 		? newPropMap.size() - 1 : 0
				fields[Extension.PAYLOAD_TYPE] 		= PayloadType.OBJECT.getDescription()
				
				def oldPropertyMap = getOldPropertyValueMap(event)
				fields[Extension.OLD_PAYLOAD] 		= oldPropertyMap?.toMapString()
				fields[Extension.OLD_PAYLOAD_CLS]	= getHostClassification()
				fields[Extension.OLD_PAYLOAD_ID] 	= event.getEntity().getId()
				fields[Extension.OLD_PAYLOAD_SIZE] 	= oldPropertyMap != null 	? oldPropertyMap.size() - 1 : 0
				fields[Extension.OLD_PAYLOAD_TYPE] 	= PayloadType.OBJECT.getDescription()
						
				cef.extension = new Extension(fields)
				
				log.info cef.toString()
			}
		} finally {
			this.resetFlushMode(mode)
		}					

	}

	@Override
	public void onPostInsert(PostInsertEvent event) {
		
		FlushMode mode = sessionFactory.getCurrentSession().getFlushMode()
		setFlushModeToManual()
		
		try{
			if(doCefLogging()){
				
				CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.OBJ_CREATE.getDescription(),
					"Object was created", 7)
				def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(),
					getApplicationVersion(), getHostClassification())
				
				def newPropMap = getNewObjectPropertyValueMap(event)
				fields[Extension.EVENT_TYPE] 	= EventTypes.OBJ_CREATE.getDescription()
				fields[Extension.PAYLOAD] 		= newPropMap?.toMapString()
				fields[Extension.PAYLOAD_CLS]	= getHostClassification()
				fields[Extension.PAYLOAD_ID] 	= event.getId().toString()
				fields[Extension.PAYLOAD_SIZE] 	= newPropMap != null ? newPropMap.size() - 1 : 0
				fields[Extension.PAYLOAD_TYPE] 	= PayloadType.OBJECT.getDescription()
				
				cef.extension = new Extension(fields)
				
				log.info cef.toString()
			}
		} finally{
			this.resetFlushMode(mode)
		}

	}

	@Override
	public void onPostDelete(PostDeleteEvent event) {
		
		FlushMode mode = sessionFactory.getCurrentSession().getFlushMode()
		setFlushModeToManual()
		
		try{
			if(doCefLogging()) {
				
				CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.OBJ_DELETE.getDescription(),
					"Object was deleted", 7)
				def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(),
					getApplicationVersion(), getHostClassification())
				
				def oldPropertyMap = getDeletedObjectPropertyValueMap(event)
				fields[Extension.EVENT_TYPE] 	= EventTypes.OBJ_DELETE.getDescription()
				fields[Extension.PAYLOAD] 		= oldPropertyMap?.toMapString()
				fields[Extension.PAYLOAD_CLS]	= getHostClassification()
				fields[Extension.PAYLOAD_ID] 	= event.getId().toString()
				fields[Extension.PAYLOAD_TYPE] 	= PayloadType.OBJECT.getDescription()
				fields[Extension.PAYLOAD_SIZE]	= oldPropertyMap != null ?
					oldPropertyMap.size() - 1 : 0
				
				cef.extension = new Extension(fields)
				
				log.info cef.toString()
			}
		} finally{
			this.resetFlushMode(mode)
		}

	}
		
	private void setFlushModeToManual(){
		Session sess = sessionFactory.getCurrentSession()
		//Setting the session isnt free so if we dont have to do it, dont.
		if(sess.getFlushMode().equals(FlushMode.MANUAL))
			return
		sess.setFlushMode(FlushMode.MANUAL)
	}
	
	private void resetFlushMode(FlushMode originalMode){
		Session sess = sessionFactory.getCurrentSession()
		//Setting the session isnt free so if we dont have to do it, dont.
		if(sess.getFlushMode().equals(originalMode))
			return
		sess.setFlushMode(originalMode)
	}
	
	//Methods below could be used in the base marketplace class "AuditLogListener"		
	protected def getDeletedObjectPropertyValueMap(PostDeleteEvent event){
        String[] properties = event.getPersister().getPropertyNames()
        Object[] state = event.getDeletedState()
        Type[] types = event.getPersister().getPropertyTypes()
		getMapFromState(event.getEntity(),state, properties, types)
	}
		
	protected def getNewObjectPropertyValueMap(PostInsertEvent event){
        String[] properties = event.getPersister().getPropertyNames()
        Object[] state = event.getState()
        Type[] types = event.getPersister().getPropertyTypes()
		getMapFromState(event.getEntity(), state, properties, types)
	}
	
	protected def getMapFromState(Object entity, Object[] state, String[] properties, Type[] types){
		def changeMap = [:]
		changeMap['CLASS'] = entity.getClass().getName()
		for (int i = 0; i < properties.length; i++) {
			if (FIELDS_TO_IGNORE.contains(properties[i])) continue
			switch(types[i]) {
				case BinaryType:
					changeMap[properties[i]] = '(binary data)'
				break
				case CollectionType:
					break
				default:
				changeMap[properties[i]] = (state[i] != null && (state[i] instanceof Date)) ? 
                    ExtensionFactory.eventDateFormatter.format(state[i]) : state[i]
			}
		}
		changeMap
	}
	
	protected def getOldPropertyValueMap(PostUpdateEvent event){
		def oldState = event.getOldState()
        if (oldState == null) {
            return null
        }

		def newState = event.getState()
		def properties = event.getPersister().getPropertyNames()
		def types = event.getPersister().getPropertyTypes()

		def changeMap = [:]
		changeMap['CLASS'] = event.getEntity().getClass().getName()
		for (int i = 0; i < properties.length; i++) {
			if (!FIELDS_TO_IGNORE.contains(properties[i])) {
				def diff = false
				if (types[i] instanceof org.hibernate.type.EntityType) {
					diff = oldState[i]?.id != newState[i]?.id
                }
				 else {
					diff = oldState[i] != newState[i]
                }
					
				if (diff){
					changeMap[properties[i]] = (oldState[i] instanceof Date) ? 
                        ExtensionFactory.eventDateFormatter.format(oldState[i]) : oldState[i]
				}
			}
		}
		changeMap
	}
	
	
	protected def getNewPropertyValueMap(PostUpdateEvent event){
		def oldState = event?.getOldState() ?: []
		def newState = event?.getState()	?: []
		def properties = event.getPersister().getPropertyNames()
		def types = event.getPersister().getPropertyTypes()

		def changeMap = [:]
		changeMap['CLASS'] = event.getEntity().getClass().getName()
		for (int i = 0; i < properties.length; i++) {
			if (!FIELDS_TO_IGNORE.contains(properties[i])) {
				def diff = false
				if (types[i] instanceof org.hibernate.type.EntityType) {
					diff = oldState[i]?.id != newState[i]?.id
                }
				else if (oldState == null) {
                    diff = true
                    log.warn "AuditLogListener recieved Update Event with null oldState"
                } else {
					diff = oldState[i] != newState[i]
                }
					
				if (diff){
					changeMap[properties[i]] = (newState[i] instanceof Date) ? 
                        ExtensionFactory.eventDateFormatter.format(newState[i]) : newState[i]
				}
			}
		}
		changeMap
	}
	
    protected abstract boolean isAccessAuditable(String entityClassName)

	protected abstract boolean doCefLogging()
	
	protected abstract boolean doCefObjectAccessLogging()
	
	protected abstract String getApplicationVersion()
	
	protected abstract String getUserName()
	
	protected abstract String getHostClassification()

	protected abstract String getDeviceVendor()

	protected abstract String getDeviceProduct()

	protected abstract String getDeviceVersion()

	protected abstract int getCEFVersion()

    protected abstract HttpServletRequest getRequest()
}

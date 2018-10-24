<%@ page import="grails.converters.JSON" contentType="text/javascript" %>

var Ozone = Ozone || {};
//externalize any config properties here as javascript properties
//this should be only place where these config properties are exposed to javascript

Ozone.config = ${raw((conf as JSON).toString())};
Ozone.initialData = ${raw((initialData as JSON).toString())};

//add in contextPath
Ozone.config.webContextPath = window.location.pathname;

// fixes 'Error: Illegal Operator !=' error in IE
Ozone.config.webContextPath = Ozone.config.webContextPath.replace(/\;jsessionid=.*/g,'');

if(Ozone.config.webContextPath.charAt(Ozone.config.webContextPath.length - 1) === '/') {
    Ozone.config.webContextPath = Ozone.config.webContextPath.substr(0,Ozone.config.webContextPath.length - 1);
}

Ozone.config.carousel = {
    restrictedTagGroupsRegex: new RegExp('^(.*,)?\s*'+Ozone.config.pendingApprovalTagGroupName+'\s*(,.*)?$','im'),
    pendingApprovalTagGroupName:Ozone.config.pendingApprovalTagGroupName,
    approvedTagGroupName: Ozone.config.approvedTagGroupName
};

Ozone.config.prefsLocation = window.location.protocol + "//" + window.location.host + window.location.pathname + "prefs";

Ozone.config.prefsLocation = Ozone.config.prefsLocation.replace(/\;jsessionid=.*/g,'');

//the default layout config for a new blank dashboard
Ozone.config.defaultLayoutConfig = {
    xtype: 'container',
    flex: 1,
    height: '100%',
    items: [],
    paneType: ""
};

//for consistency add the properties onto the new OWF namespace
var OWF  = OWF || {};
OWF.config = Ozone.config;
OWF.getContainerUrl = function() {
    //figure out from preference location
    var pref = Ozone.config.prefsLocation;
    return pref.substring(0, pref.length - 6);
};

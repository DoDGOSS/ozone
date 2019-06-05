package ozone.owf.devel

import grails.converters.JSON

import ozone.owf.grails.domain.ERoleAuthority


class DefaultData {

    public static final List<Map> APPLICATION_CONFIGURATION =
            [[code         : 'owf.enable.cef.logging',
              value        : 'false',
              title        : 'Enable CEF Logging',
              type         : 'Boolean',
              groupName    : 'AUDITING',
              subGroupOrder: 1],

             [code         : 'owf.enable.cef.object.access.logging',
              value        : 'false',
              title        : 'Enable CEF Object Access Logging',
              type         : 'Boolean',
              groupName    : 'AUDITING',
              subGroupOrder: 2],

             [code         : 'owf.enable.cef.log.sweep',
              value        : 'false',
              title        : 'Enable CEF Sweep Log',
              type         : 'Boolean',
              groupName    : 'AUDITING',
              subGroupOrder: 3],

             [code         : 'owf.cef.log.location',
              value        : '/usr/share/tomcat6',
              title        : 'CEF Log Location',
              type         : 'String',
              groupName    : 'AUDITING',
              subGroupOrder: 4],

             [code         : 'owf.cef.sweep.log.location',
              value        : '/var/log/cef',
              title        : 'CEF Sweep Log Location',
              type         : 'String',
              groupName    : 'AUDITING',
              subGroupOrder: 5],

             [code         : 'owf.security.level',
              value        : null,
              title        : 'Security Level',
              type         : 'String',
              groupName    : 'AUDITING',
              subGroupOrder: 6],

             [code         : 'owf.session.control.enabled',
              value        : 'false',
              title        : 'Enable Session Control',
              type         : 'Boolean',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Session Control',
              subGroupOrder: 1],

             [code         : 'owf.session.control.max.concurrent',
              value        : '1',
              title        : 'Max Concurrent Sessions',
              type         : 'Integer',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Session Control',
              subGroupOrder: 2],

             [code         : 'owf.disable.inactive.accounts',
              value        : 'true',
              title        : 'Disable Inactive Accounts',
              type         : 'Boolean',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Inactive Accounts',
              subGroupOrder: 1],

             [code         : 'owf.inactivity.threshold',
              value        : '90',
              title        : 'Account Inactivity Threshold',
              type         : 'Integer',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Inactive Accounts',
              subGroupOrder: 2],

             [code         : 'owf.job.disable.accounts.start.time',
              value        : '23:59:59',
              title        : 'Disable Accounts Job Start Time',
              type         : 'String',
              groupName    : 'HIDDEN',
              subGroupOrder: 1],

             [code         : 'owf.job.disable.accounts.interval',
              value        : '1440',
              title        : 'Disable Accounts Job Interval',
              type         : 'Integer',
              groupName    : 'HIDDEN',
              subGroupOrder: 2],

             [code         : 'free.warning.content',
              value        : null,
              title        : 'Warning Banner Content',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupOrder: 1],

             [code         : 'owf.custom.background.url',
              value        : '',
              title        : 'Custom Background URL',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Background',
              subGroupOrder: 1],

             [code         : 'owf.custom.header.url',
              value        : null,
              title        : 'Custom Header URL',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 1],

             [code         : 'owf.custom.header.height',
              value        : '0',
              title        : 'Custom Header Height',
              type         : 'Integer',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 2],

             [code         : 'owf.custom.footer.url',
              value        : null,
              title        : 'Custom Footer URL',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 3],

             [code         : 'owf.custom.footer.height',
              value        : '0',
              title        : 'Custom Footer Height',
              type         : 'Integer',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 4],

             [code         : 'owf.custom.css',
              value        : null,
              title        : 'Custom CSS',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 5],

             [code         : 'owf.custom.jss',
              value        : null,
              title        : 'Custom Javascript',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 6]]


    public static final Map ADMIN_GROUP =
            [automatic  : true,
             name       : 'OWF Administrators',
             displayName: 'OWF Administrators',
             description: 'OWF Administrators']

    public static final Map USER_GROUP =
            [automatic  : true,
             name       : 'OWF Users',
             displayName: 'OWF Users',
             description: 'OWF Users']


    public static final Map ADMIN_ROLE =
            [authority  : ERoleAuthority.ROLE_ADMIN.strVal,
             description: "Admin Role"]

    public static final Map USER_ROLE =
            [authority  : ERoleAuthority.ROLE_USER.strVal,
             description: "User Role"]


    public static final Map ADMIN1 =
            [username    : 'testAdmin1',
             userRealName: 'Test Administrator 1',
             description : 'Test Administrator 1',
             email       : 'testAdmin1@ozone.test']

    public static final Map USER1 =
            [username    : 'testUser1',
             userRealName: 'Test User 1',
             description : 'Test User 1',
             email       : 'testUser1@ozone.test']


    public static final List<Map> ADMIN1_PREFERENCES =
            [[namespace: 'owf.admin.UserEditCopy',
              path     : 'guid_to_launch',
              value    : 'a9bf8e71-692d-44e3-a465-5337ce5e725e'],
             [namespace: 'owf.admin.WidgetEditCopy',
              path     : 'guid_to_launch',
              value    : '679294b3-ccc3-4ace-a061-e3f27ed86451'],
             [namespace: 'owf.admin.GroupEditCopy',
              path     : 'guid_to_launch',
              value    : 'dc5c2062-aaa8-452b-897f-60b4b55ab564'],
             [namespace: 'owf.admin.DashboardEditCopy',
              path     : 'guid_to_launch',
              value    : '2445afb9-eb3f-4b79-acf8-6b12180921c3'],
             [namespace: 'owf.admin.StackEditCopy',
              path     : 'guid_to_launch',
              value    : '72c382a3-89e7-4abf-94db-18db7779e1df']]


    public static final Map<String, String> ADMIN_WIDGET_TYPE =
            [name: 'administration', displayName: 'administration']

    public static final Map<String, String> STANDARD_WIDGET_TYPE =
            [name: 'standard', displayName: 'standard']

    public static final List<Map> WIDGET_TYPES =
            [STANDARD_WIDGET_TYPE,
             ADMIN_WIDGET_TYPE,
             [name: 'marketplace', displayName: 'store'],
             [name: 'metric', displayName: 'metric'],
             [name: 'fullscreen', displayName: 'fullscreen']]


    public static final List<Map> ADMIN_WIDGET_DEFINITIONS =
            [[displayName   : 'Widget Administration',
              widgetGuid    : '3f3692dc-1c85-4da2-8a1b-ab38d08dce4a',
              universalName : 'org.ozoneplatform.owf.admin.WidgetAdmin',
              widgetUrl     : 'local:widget_admin',
              widgetVersion : '1.0',
              imageUrlSmall : 'images/widgets/widgets-manager.png',
              imageUrlMedium: 'images/widgets/widgets-manager.png',
              width         : 400,
              height        : 400],

             [displayName   : 'Stack Administration',
              widgetGuid    : '2a34e59c-9cc5-484f-a4e4-e19042d73a43',
              universalName : 'org.ozoneplatform.owf.admin.DashboardAdmin',
              widgetUrl     : 'local:dashboard_admin',
              widgetVersion : '1.0',
              imageUrlSmall : 'images/widgets/dashboards-manager.png',
              imageUrlMedium: 'images/widgets/dashboards-manager.png',
              width         : 400,
              height        : 400],

             [displayName   : 'User Administration',
              widgetGuid    : 'fe086235-c00a-4253-88d7-394a108aa3bd',
              universalName : 'org.ozoneplatform.owf.admin.UserAdmin',
              widgetUrl     : 'local:user_admin',
              widgetVersion : '1.0',
              imageUrlSmall : 'images/widgets/users-manager.png',
              imageUrlMedium: 'images/widgets/users-manager.png',
              width         : 400,
              height        : 400],

             [displayName   : 'Group Administration',
              widgetGuid    : 'd0df4235-b0b3-43fe-8b3d-f110bedd95f9',
              universalName : 'org.ozoneplatform.owf.admin.GroupAdmin',
              widgetUrl     : 'local:group_admin',
              widgetVersion : '1.0',
              imageUrlSmall : 'images/widgets/groups-manager.png',
              imageUrlMedium: 'images/widgets/groups-manager.png',
              width         : 400,
              height        : 400],

             [displayName   : 'System Configuration',
              widgetGuid    : 'f1088c8a-8137-49ff-be62-dc0a1be530b7',
              universalName : 'org.ozoneplatform.owf.admin.SystemConfig',
              widgetUrl     : 'local:system_config',
              widgetVersion : '1.0',
              imageUrlSmall : 'images/widgets/configuration-manager.png',
              imageUrlMedium: 'images/widgets/configuration-manager.png',
              width         : 400,
              height        : 400]]

    public static final Map ADMIN_STACK =
            [name             : 'Administration',
             description      : 'This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.',
             stackContext     : 'ef8b5d6f-4b16-4743-9a57-31683c94b616',
             imageUrl         : 'themes/common/images/admin/64x64_admin_app.png',
             uniqueWidgetCount: 5,
             approved         : true]

    public static final Map SAMPLE_STACK =
            [name             : 'Sample',
             stackContext     : '908d934d-9d53-406c-8143-90b406fb508f',
             uniqueWidgetCount: 2,
             approved         : true]


    private static String json(Object value) {
        (value as JSON).toString()
    }

}

export const PREFERENCES = [
    {
        id: 1,
        namespace: "owf.admin.UserEditCopy",
        path: "guid_to_launch",
        value: "a9bf8e71-692d-44e3-a465-5337ce5e725e",
        user: { userId: "admin" }
    },
    {
        id: 2,
        namespace: "owf.admin.WidgetEditCopy",
        path: "guid_to_launch",
        value: "679294b3-ccc3-4ace-a061-e3f27ed86451",
        user: { userId: "admin" }
    },
    {
        id: 3,
        namespace: "owf.admin.GroupEditCopy",
        path: "guid_to_launch",
        value: "dc5c2062-aaa8-452b-897f-60b4b55ab564",
        user: { userId: "admin" }
    },
    {
        id: 4,
        namespace: "owf.admin.DashboardEditCopy",
        path: "guid_to_launch",
        value: "2445afb9-eb3f-4b79-acf8-6b12180921c3",
        user: { userId: "admin" }
    },
    {
        id: 5,
        namespace: "owf.admin.StackEditCopy",
        path: "guid_to_launch",
        value: "72c382a3-89e7-4abf-94db-18db7779e1df",
        user: { userId: "admin" }
    }
];

export const USERS = [
    {
        totalStacks: 0,
        hasPWD: null,
        totalGroups: 1,
        id: 1,
        userRealName: "Test Administrator 1",
        totalWidgets: 0,
        username: "admin",
        email: "admin@goss.com",
        lastLogin: null,
        totalDashboards: 0
    },
    {
        totalStacks: 0,
        hasPWD: null,
        totalGroups: 1,
        id: 2,
        userRealName: "Test User 1",
        totalWidgets: 0,
        username: "user",
        email: "user@goss.com",
        lastLogin: null,
        totalDashboards: 0
    }
];

export const GROUPS = [
    {
        stackDefault: false,
        totalStacks: 1,
        status: "active",
        totalUsers: 1,
        id: 1,
        description: "OWF Administrators",
        totalWidgets: 10,
        email: null,
        name: "OWF Administrators",
        automatic: true,
        displayName: "OWF Administrators"
    },
    {
        stackDefault: false,
        totalStacks: 2,
        status: "active",
        totalUsers: 1,
        id: 2,
        description: "OWF Users",
        totalWidgets: 0,
        email: null,
        name: "OWF Users",
        automatic: true,
        displayName: "OWF Users"
    }
];

export const STACKS = [
    {
        approved: true,
        imageUrl: "themes/common/images/admin/64x64_admin_app.png",
        owner: null,
        totalUsers: 1,
        totalGroups: 1,
        id: 1,
        groups: [
            {
                stackDefault: false,
                totalStacks: 0,
                status: "active",
                totalUsers: 0,
                id: 1,
                description: "OWF Administrators",
                totalWidgets: 0,
                email: null,
                name: "OWF Administrators",
                automatic: true,
                displayName: "OWF Administrators"
            }
        ],
        stackContext: "ef8b5d6f-4b16-4743-9a57-31683c94b616",
        defaultGroup: {
            stackDefault: false,
            totalStacks: 0,
            status: "active",
            totalUsers: 0,
            id: 1,
            description: "OWF Administrators",
            totalWidgets: 0,
            email: null,
            name: "OWF Administrators",
            automatic: true,
            displayName: "OWF Administrators"
        },
        descriptorUrl: null,
        description:
            "This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.",
        totalWidgets: 0,
        name: "Administration",
        totalDashboards: 0
    },
    {
        approved: true,
        imageUrl: null,
        owner: null,
        totalUsers: 1,
        totalGroups: 1,
        id: 2,
        groups: [
            {
                stackDefault: false,
                totalStacks: 0,
                status: "active",
                totalUsers: 0,
                id: 2,
                description: "OWF Users",
                totalWidgets: 0,
                email: null,
                name: "OWF Users",
                automatic: true,
                displayName: "OWF Users"
            }
        ],
        stackContext: "investments",
        defaultGroup: {
            stackDefault: false,
            totalStacks: 0,
            status: "active",
            totalUsers: 0,
            id: 2,
            description: "OWF Users",
            totalWidgets: 0,
            email: null,
            name: "OWF Users",
            automatic: true,
            displayName: "OWF Users"
        },
        descriptorUrl: null,
        description: "Sample app containing example investment pages.",
        totalWidgets: 0,
        name: "Investments",
        totalDashboards: 0
    },
    {
        approved: true,
        imageUrl: null,
        owner: null,
        totalUsers: 1,
        totalGroups: 1,
        id: 3,
        groups: [
            {
                stackDefault: false,
                totalStacks: 0,
                status: "active",
                totalUsers: 0,
                id: 2,
                description: "OWF Users",
                totalWidgets: 0,
                email: null,
                name: "OWF Users",
                automatic: true,
                displayName: "OWF Users"
            }
        ],
        stackContext: "908d934d-9d53-406c-8143-90b406fb508f",
        defaultGroup: {
            stackDefault: false,
            totalStacks: 0,
            status: "active",
            totalUsers: 0,
            id: 2,
            description: "OWF Users",
            totalWidgets: 0,
            email: null,
            name: "OWF Users",
            automatic: true,
            displayName: "OWF Users"
        },
        descriptorUrl: null,
        description: null,
        totalWidgets: 0,
        name: "Sample",
        totalDashboards: 0
    }
];

export const WIDGET_TYPES = [
    {
        id: 2,
        name: "administration",
        displayName: "administration"
    },
    {
        id: 5,
        name: "fullscreen",
        displayName: "fullscreen"
    },
    {
        id: 4,
        name: "metric",
        displayName: "metric"
    },
    {
        id: 1,
        name: "standard",
        displayName: "standard"
    },
    {
        id: 3,
        name: "marketplace",
        displayName: "store"
    }
];

export const WIDGETS = [
    {
        id: "679294b3-ccc3-4ace-a061-e3f27ed86451",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.appcomponentedit",
            namespace: "App Component Editor",
            description: "",
            url: "admin/WidgetEdit",
            headerIcon: "themes/common/images/adm-tools/Widgets24.png",
            image: "themes/common/images/adm-tools/Widgets64.png",
            smallIconUrl: "themes/common/images/adm-tools/Widgets24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Widgets64.png",
            width: 581,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: false,
            directRequired: [],
            allRequired: [],
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 2,
                    name: "administration",
                    displayName: "administration"
                }
            ]
        },
        path: "679294b3-ccc3-4ace-a061-e3f27ed86451"
    },
    {
        id: "48edfe94-4291-4991-a648-c19a903a663b",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.appcomponentmanagement",
            namespace: "App Components",
            description: "",
            url: "admin/WidgetManagement",
            headerIcon: "themes/common/images/adm-tools/Widgets24.png",
            image: "themes/common/images/adm-tools/Widgets64.png",
            smallIconUrl: "themes/common/images/adm-tools/Widgets24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Widgets64.png",
            width: 818,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 2,
                    name: "administration",
                    displayName: "administration"
                }
            ]
        },
        path: "48edfe94-4291-4991-a648-c19a903a663b"
    },
    {
        id: "dc5c2062-aaa8-452b-897f-60b4b55ab564",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.groupedit",
            namespace: "Group Editor",
            description: "",
            url: "admin/GroupEdit",
            headerIcon: "themes/common/images/adm-tools/Groups24.png",
            image: "themes/common/images/adm-tools/Groups64.png",
            smallIconUrl: "themes/common/images/adm-tools/Groups24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Groups64.png",
            width: 581,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: false,
            directRequired: [],
            allRequired: [],
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 2,
                    name: "administration",
                    displayName: "administration"
                }
            ]
        },
        path: "dc5c2062-aaa8-452b-897f-60b4b55ab564"
    },
    {
        id: "53a2a879-442c-4012-9215-a17604dedff7",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.groupmanagement",
            namespace: "Groups",
            description: "",
            url: "admin/GroupManagement",
            headerIcon: "themes/common/images/adm-tools/Groups24.png",
            image: "themes/common/images/adm-tools/Groups64.png",
            smallIconUrl: "themes/common/images/adm-tools/Groups24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Groups64.png",
            width: 818,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 2,
                    name: "administration",
                    displayName: "administration"
                }
            ]
        },
        path: "53a2a879-442c-4012-9215-a17604dedff7"
    },
    {
        id: "a9bf8e71-692d-44e3-a465-5337ce5e725e",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.useredit",
            namespace: "User Editor",
            description: "",
            url: "admin/UserEdit",
            headerIcon: "themes/common/images/adm-tools/Users24.png",
            image: "themes/common/images/adm-tools/Users64.png",
            smallIconUrl: "themes/common/images/adm-tools/Users24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Users64.png",
            width: 581,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: false,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 2, name: "administration", displayName: "administration" }]
        },
        path: "a9bf8e71-692d-44e3-a465-5337ce5e725e"
    },
    {
        id: "38070c45-5f6a-4460-810c-6e3496495ec4",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.usermanagement",
            namespace: "Users",
            description: "",
            url: "admin/UserManagement",
            headerIcon: "themes/common/images/adm-tools/Users24.png",
            image: "themes/common/images/adm-tools/Users64.png",
            smallIconUrl: "themes/common/images/adm-tools/Users24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Users64.png",
            width: 818,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 2, name: "administration", displayName: "administration" }]
        },
        path: "38070c45-5f6a-4460-810c-6e3496495ec4"
    },
    {
        id: "af180bfc-3924-4111-93de-ad6e9bfc060e",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.configuration",
            namespace: "Configuration",
            description: "",
            url: "admin/Configuration",
            headerIcon: "themes/common/images/adm-tools/Configuration24.png",
            image: "themes/common/images/adm-tools/Configuration64.png",
            smallIconUrl: "themes/common/images/adm-tools/Configuration24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Configuration64.png",
            width: 900,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 2, name: "administration", displayName: "administration" }]
        },
        path: "af180bfc-3924-4111-93de-ad6e9bfc060e"
    },
    {
        id: "72c382a3-89e7-4abf-94db-18db7779e1df",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.appedit",
            namespace: "App Editor",
            description: "",
            url: "admin/StackEdit",
            headerIcon: "themes/common/images/adm-tools/Stacks24.png",
            image: "themes/common/images/adm-tools/Stacks64.png",
            smallIconUrl: "themes/common/images/adm-tools/Stacks24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Stacks64.png",
            width: 581,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: false,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 2, name: "administration", displayName: "administration" }]
        },
        path: "72c382a3-89e7-4abf-94db-18db7779e1df"
    },
    {
        id: "391dd2af-a207-41a3-8e51-2b20ec3e7241",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.appmanagement",
            namespace: "Apps",
            description: "",
            url: "admin/StackManagement",
            headerIcon: "themes/common/images/adm-tools/Stacks24.png",
            image: "themes/common/images/adm-tools/Stacks64.png",
            smallIconUrl: "themes/common/images/adm-tools/Stacks24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Stacks64.png",
            width: 818,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 2, name: "administration", displayName: "administration" }]
        },
        path: "391dd2af-a207-41a3-8e51-2b20ec3e7241"
    },
    {
        id: "2445afb9-eb3f-4b79-acf8-6b12180921c3",
        namespace: "widget",
        value: {
            universalName: "org.ozoneplatform.owf.admin.pageedit",
            namespace: "Page Editor",
            description: "",
            url: "admin/DashboardEdit",
            headerIcon: "themes/common/images/adm-tools/Dashboards24.png",
            image: "themes/common/images/adm-tools/Dashboards64.png",
            smallIconUrl: "themes/common/images/adm-tools/Dashboards24.png",
            mediumIconUrl: "themes/common/images/adm-tools/Dashboards64.png",
            width: 581,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 1,
            totalGroups: 1,
            singleton: false,
            visible: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: false,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 2, name: "administration", displayName: "administration" }]
        },
        path: "2445afb9-eb3f-4b79-acf8-6b12180921c3"
    },
    {
        id: "774def2a-9b5f-4d1b-bdfe-7a4464e1a458",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.ChannelShouter",
            namespace: "Channel Shouter",
            description: "Broadcast a message on a specified channel.",
            url: "widgets/channel_shouter",
            headerIcon: "static/themes/common/images/widget-icons/ChannelShouter.png",
            image: "static/themes/common/images/widget-icons/ChannelShouter.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ChannelShouter.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/ChannelShouter.png",
            width: 295,
            height: 250,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "774def2a-9b5f-4d1b-bdfe-7a4464e1a458"
    },
    {
        id: "4cfdd43c-a642-457e-908a-76beea46f9bb",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.ChannelListener",
            namespace: "Channel Listener",
            description: "Receive a message on a specified channel.",
            url: "widgets/channel_listener",
            headerIcon: "static/themes/common/images/widget-icons/ChannelListener.png",
            image: "static/themes/common/images/widget-icons/ChannelListener.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ChannelListener.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/ChannelListener.png",
            width: 540,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "4cfdd43c-a642-457e-908a-76beea46f9bb"
    },
    {
        id: "90c3d997-1c51-4071-a11b-bfd66bb8df79",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.ColorServer",
            namespace: "Color Server",
            description: "Simple eventing example that works in tandem with Color Client.",
            url: "widgets/color_server",
            headerIcon: "static/themes/common/images/widget-icons/ColorServer.png",
            image: "static/themes/common/images/widget-icons/ColorServer.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ColorServer.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/ColorServer.png",
            width: 300,
            height: 300,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "90c3d997-1c51-4071-a11b-bfd66bb8df79"
    },
    {
        id: "e10cf3ae-302c-4df5-a894-23758a1a311e",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.ColorClient",
            namespace: "Color Client",
            description: "Simple eventing example that works in tandem with Color Server.",
            url: "widgets/color_client",
            headerIcon: "static/themes/common/images/widget-icons/ColorClient.png",
            image: "static/themes/common/images/widget-icons/ColorClient.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ColorClient.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/ColorClient.png",
            width: 300,
            height: 300,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "e10cf3ae-302c-4df5-a894-23758a1a311e"
    },
    {
        id: "ff9419a7-a1d4-4e5a-b0ad-0a90fbfa7dce",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.WidgetLog",
            namespace: "Widget Log",
            description: "Display log messages from widgets with logging enabled.",
            url: "widgets/widget_log",
            headerIcon: "static/themes/common/images/widget-icons/WidgetLog.png",
            image: "static/themes/common/images/widget-icons/WidgetLog.png",
            smallIconUrl: "static/themes/common/images/widget-icons/WidgetLog.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/WidgetLog.png",
            width: 540,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "ff9419a7-a1d4-4e5a-b0ad-0a90fbfa7dce"
    },
    {
        id: "b239c285-7390-4911-8e0f-125b6187b4fb",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.WidgetChrome",
            namespace: "Widget Chrome",
            description: "Example that utilizes the Widget Chrome API",
            url: "widgets/widget_chrome",
            headerIcon: "static/themes/common/images/widget-icons/WidgetChrome.png",
            image: "static/themes/common/images/widget-icons/WidgetChrome.png",
            smallIconUrl: "static/themes/common/images/widget-icons/WidgetChrome.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/WidgetChrome.png",
            width: 540,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "b239c285-7390-4911-8e0f-125b6187b4fb"
    },
    {
        id: "07360c3b-7750-425f-81c5-5bc5f5adcc6a",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.Preferences",
            namespace: "Preferences",
            description: "Example that utilizes the Preferences API",
            url: "widgets/preferences",
            headerIcon: "static/themes/common/images/widget-icons/Preferences.png",
            image: "static/themes/common/images/widget-icons/Preferences.png",
            smallIconUrl: "static/themes/common/images/widget-icons/Preferences.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/Preferences.png",
            width: 450,
            height: 300,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "07360c3b-7750-425f-81c5-5bc5f5adcc6a"
    },
    {
        id: "a11f163d-0909-4a79-b9c4-e450a208045f",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.EventMonitor",
            namespace: "Event Monitor Widget",
            description: "Example that utilizes the Eventing API.",
            url: "widgets/event_monitor",
            headerIcon: "static/themes/common/images/widget-icons/EventMonitor.png",
            image: "static/themes/common/images/widget-icons/EventMonitor.png",
            smallIconUrl: "static/themes/common/images/widget-icons/EventMonitor.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/EventMonitor.png",
            width: 500,
            height: 600,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "a11f163d-0909-4a79-b9c4-e450a208045f"
    },
    {
        id: "2f5a1f11-47a3-488f-9f8b-0afc2ffc516f",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.HTMLViewer",
            namespace: "HTML Viewer",
            description: "This app component displays HTML.",
            url: "widgets/html_viewer",
            headerIcon: "static/themes/common/images/widget-icons/HTMLViewer.png",
            image: "static/themes/common/images/widget-icons/HTMLViewer.png",
            smallIconUrl: "static/themes/common/images/widget-icons/HTMLViewer.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/HTMLViewer.png",
            width: 400,
            height: 600,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: { send: [], receive: [{ action: "View", dataTypes: ["text/html"] }] },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "2f5a1f11-47a3-488f-9f8b-0afc2ffc516f"
    },
    {
        id: "01468dfe-958f-48ea-aad6-068fbd715312",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.NYSE",
            namespace: "NYSE Widget",
            description: "This app component displays the end of day report for the New York Stock Exchange.",
            url: "widgets/nyse",
            headerIcon: "static/themes/common/images/widget-icons/NYSEStock.png",
            image: "static/themes/common/images/widget-icons/NYSEStock.png",
            smallIconUrl: "static/themes/common/images/widget-icons/NYSEStock.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/NYSEStock.png",
            width: 825,
            height: 437,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: {
                send: [
                    {
                        action: "Graph",
                        dataTypes: ["application/vnd.owf.sample.price"]
                    },
                    { action: "View", dataTypes: ["text/html"] }
                ],
                receive: []
            },
            widgetTypes: [{ id: 1, name: "standard", displayName: "standard" }]
        },
        path: "01468dfe-958f-48ea-aad6-068fbd715312"
    },
    {
        id: "a5e96763-b093-4ba5-ba6b-f1130a44329f",
        namespace: "widget",
        value: {
            universalName: "org.owfgoss.owf.examples.StockChart",
            namespace: "Stock Chart",
            description: "This app component charts stock prices.",
            url: "widgets/stock_chart",
            headerIcon: "static/themes/common/images/widget-icons/PriceChart.png",
            image: "static/themes/common/images/widget-icons/PriceChart.png",
            smallIconUrl: "static/themes/common/images/widget-icons/PriceChart.png",
            mediumIconUrl: "static/themes/common/images/widget-icons/PriceChart.png",
            width: 800,
            height: 600,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            totalUsers: 2,
            totalGroups: 0,
            singleton: false,
            visible: true,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            definitionVisible: true,
            directRequired: [],
            allRequired: [],
            intents: {
                send: [],
                receive: [
                    {
                        action: "Graph",
                        dataTypes: ["application/vnd.owf.sample.price"]
                    }
                ]
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        },
        path: "a5e96763-b093-4ba5-ba6b-f1130a44329f"
    }
];

export const WIDGET_DEFINITION = {
    id: "a5e96763-b093-4ba5-ba6b-f1130a44329f",
    namespace: "widget",
    value: {
        universalName: "org.owfgoss.owf.examples.StockChart",
        namespace: "Stock Chart",
        description: "This app component charts stock prices.",
        url: "widgets/stock_chart",
        headerIcon: "static/themes/common/images/widget-icons/PriceChart.png",
        image: "static/themes/common/images/widget-icons/PriceChart.png",
        smallIconUrl: "static/themes/common/images/widget-icons/PriceChart.png",
        mediumIconUrl: "static/themes/common/images/widget-icons/PriceChart.png",
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        minimized: false,
        maximized: false,
        widgetVersion: "1.0",
        totalUsers: 0,
        totalGroups: 0,
        singleton: false,
        visible: true,
        background: false,
        mobileReady: false,
        descriptorUrl: null,
        definitionVisible: true,
        directRequired: [],
        allRequired: [],
        intents: {
            send: [],
            receive: [
                {
                    action: "Graph",
                    dataTypes: ["application/vnd.owf.sample.price"]
                }
            ]
        },
        widgetTypes: [
            {
                id: 1,
                name: "standard",
                displayName: "standard"
            }
        ]
    },
    path: "a5e96763-b093-4ba5-ba6b-f1130a44329f"
};

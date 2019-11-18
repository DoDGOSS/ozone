export const USER_DASHBOARD_STACK = {
    owner: {
        lastLogin: null,
        id: 2,
        userRealName: "Test User 1",
        email: "user@goss.com",
        username: "user"
    },
    stackContext: "452117c2-57d0-4fdb-9750-b3b970ee1039",
    totalWidgets: 0,
    approved: false,
    imageUrl: null,
    name: "Untitled",
    description: null,
    descriptorUrl: null,
    id: 4
};

export const USER_DASHBOARD_USER = {
    lastLogin: null,
    id: 2,
    userRealName: "Test User 1",
    email: "user@goss.com",
    username: "user"
};

export const USER_DASHBOARD = {
    stack: USER_DASHBOARD_STACK,
    dashboardPosition: 0,
    iconImageUrl: null,
    description: null,
    type: null,
    markedForDeletion: false,
    alteredByAdmin: false,
    layoutConfig: "{}",
    publishedToStore: true,
    isGroupDashboard: false,
    name: "Untitled",
    guid: "0ca327dd-4817-448f-880b-990ff8922ada",
    isdefault: false,
    locked: false,
    user: USER_DASHBOARD_USER
};

export const USER_WIDGETS = [
    {
        namespace: "widget",
        path: "b5cafdf8-2cf2-4e5c-9b3f-916f57228ee2",
        id: 22,
        value: {
            originalName: "Channel Shouter",
            universalName: "org.owfgoss.owf.examples.ChannelShouter",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 0,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Channel Shouter",
            description: "Broadcast a message on a specified channel.",
            url: "widgets/channel_shouter",
            headerIcon: "static/themes/common/images/widget-icons/ChannelShouter.png",
            image: "static/themes/common/images/widget-icons/ChannelShouter.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ChannelShouter.png",
            largeIconUrl: "static/themes/common/images/widget-icons/ChannelShouter.png",
            width: 295,
            height: 250,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "ce587ed3-c7a1-419b-914a-721cb0302340",
        id: 23,
        value: {
            originalName: "Channel Listener",
            universalName: "org.owfgoss.owf.examples.ChannelListener",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 1,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Channel Listener",
            description: "Receive a message on a specified channel.",
            url: "widgets/channel_listener",
            headerIcon: "static/themes/common/images/widget-icons/ChannelListener.png",
            image: "static/themes/common/images/widget-icons/ChannelListener.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ChannelListener.png",
            largeIconUrl: "static/themes/common/images/widget-icons/ChannelListener.png",
            width: 540,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "de51f922-a9ca-4cb8-b7ad-37cd35720fe0",
        id: 24,
        value: {
            originalName: "Color Server",
            universalName: "org.owfgoss.owf.examples.ColorServer",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 2,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Color Server",
            description: "Simple eventing example that works in tandem with Color Client.",
            url: "widgets/color_server",
            headerIcon: "static/themes/common/images/widget-icons/ColorServer.png",
            image: "static/themes/common/images/widget-icons/ColorServer.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ColorServer.png",
            largeIconUrl: "static/themes/common/images/widget-icons/ColorServer.png",
            width: 300,
            height: 300,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "0607d65e-5f36-448c-9842-e124c88b40b0",
        id: 25,
        value: {
            originalName: "Color Client",
            universalName: "org.owfgoss.owf.examples.ColorClient",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 3,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Color Client",
            description: "Simple eventing example that works in tandem with Color Server.",
            url: "widgets/color_client",
            headerIcon: "static/themes/common/images/widget-icons/ColorClient.png",
            image: "static/themes/common/images/widget-icons/ColorClient.png",
            smallIconUrl: "static/themes/common/images/widget-icons/ColorClient.png",
            largeIconUrl: "static/themes/common/images/widget-icons/ColorClient.png",
            width: 300,
            height: 300,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "6b24f6e5-2e49-47de-a114-ec93a09d5609",
        id: 26,
        value: {
            originalName: "Widget Log",
            universalName: "org.owfgoss.owf.examples.WidgetLog",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 4,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Widget Log",
            description: "Display log messages from widgets with logging enabled.",
            url: "widgets/widget_log",
            headerIcon: "static/themes/common/images/widget-icons/WidgetLog.png",
            image: "static/themes/common/images/widget-icons/WidgetLog.png",
            smallIconUrl: "static/themes/common/images/widget-icons/WidgetLog.png",
            largeIconUrl: "static/themes/common/images/widget-icons/WidgetLog.png",
            width: 540,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "5c66df9c-fc03-4a7e-bf83-b84b2c4cf800",
        id: 27,
        value: {
            originalName: "Widget Chrome",
            universalName: "org.owfgoss.owf.examples.WidgetChrome",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 5,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Widget Chrome",
            description: "Example that utilizes the Widget Chrome API",
            url: "widgets/widget_chrome",
            headerIcon: "static/themes/common/images/widget-icons/WidgetChrome.png",
            image: "static/themes/common/images/widget-icons/WidgetChrome.png",
            smallIconUrl: "static/themes/common/images/widget-icons/WidgetChrome.png",
            largeIconUrl: "static/themes/common/images/widget-icons/WidgetChrome.png",
            width: 540,
            height: 440,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "8757cb65-34c9-4bc1-ac49-c0a2ae101a05",
        id: 28,
        value: {
            originalName: "Preferences",
            universalName: "org.owfgoss.owf.examples.Preferences",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 6,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Preferences",
            description: "Example that utilizes the Preferences API",
            url: "widgets/preferences",
            headerIcon: "static/themes/common/images/widget-icons/Preferences.png",
            image: "static/themes/common/images/widget-icons/Preferences.png",
            smallIconUrl: "static/themes/common/images/widget-icons/Preferences.png",
            largeIconUrl: "static/themes/common/images/widget-icons/Preferences.png",
            width: 450,
            height: 300,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "036b692a-8492-4f19-9e8c-800b5444cc6b",
        id: 29,
        value: {
            originalName: "Event Monitor Widget",
            universalName: "org.owfgoss.owf.examples.EventMonitor",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 7,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Event Monitor Widget",
            description: "Example that utilizes the Eventing API.",
            url: "widgets/event_monitor",
            headerIcon: "static/themes/common/images/widget-icons/EventMonitor.png",
            image: "static/themes/common/images/widget-icons/EventMonitor.png",
            smallIconUrl: "static/themes/common/images/widget-icons/EventMonitor.png",
            largeIconUrl: "static/themes/common/images/widget-icons/EventMonitor.png",
            width: 500,
            height: 600,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "4ad9e641-4774-42fd-b331-b875dd68e646",
        id: 30,
        value: {
            originalName: "HTML Viewer",
            universalName: "org.owfgoss.owf.examples.HTMLViewer",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 8,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "HTML Viewer",
            description: "This app component displays HTML.",
            url: "widgets/html_viewer",
            headerIcon: "static/themes/common/images/widget-icons/HTMLViewer.png",
            image: "static/themes/common/images/widget-icons/HTMLViewer.png",
            smallIconUrl: "static/themes/common/images/widget-icons/HTMLViewer.png",
            largeIconUrl: "static/themes/common/images/widget-icons/HTMLViewer.png",
            width: 400,
            height: 600,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [],
                receive: [
                    {
                        action: "View",
                        dataTypes: ["text/html"]
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
        }
    },
    {
        namespace: "widget",
        path: "015761c8-95d3-45ab-a16a-b6974bce03df",
        id: 31,
        value: {
            originalName: "NYSE Widget",
            universalName: "org.owfgoss.owf.examples.NYSE",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 9,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "NYSE Widget",
            description: "This app component displays the end of day report for the New York Stock Exchange.",
            url: "widgets/nyse",
            headerIcon: "static/themes/common/images/widget-icons/NYSEStock.png",
            image: "static/themes/common/images/widget-icons/NYSEStock.png",
            smallIconUrl: "static/themes/common/images/widget-icons/NYSEStock.png",
            largeIconUrl: "static/themes/common/images/widget-icons/NYSEStock.png",
            width: 825,
            height: 437,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
            intents: {
                send: [
                    {
                        action: "View",
                        dataTypes: ["text/html"]
                    },
                    {
                        action: "Graph",
                        dataTypes: ["application/vnd.owf.sample.price"]
                    }
                ],
                receive: []
            },
            widgetTypes: [
                {
                    id: 1,
                    name: "standard",
                    displayName: "standard"
                }
            ]
        }
    },
    {
        namespace: "widget",
        path: "f091bcbb-c6cf-44dc-9681-12a867a7d5ae",
        id: 32,
        value: {
            originalName: "Stock Chart",
            universalName: "org.owfgoss.owf.examples.StockChart",
            editable: true,
            disabled: false,
            visible: true,
            favorite: false,
            groupWidget: false,
            position: 10,
            userId: "user",
            userRealName: "Test User 1",
            namespace: "Stock Chart",
            description: "This app component charts stock prices.",
            url: "widgets/stock_chart",
            headerIcon: "static/themes/common/images/widget-icons/PriceChart.png",
            image: "static/themes/common/images/widget-icons/PriceChart.png",
            smallIconUrl: "static/themes/common/images/widget-icons/PriceChart.png",
            largeIconUrl: "static/themes/common/images/widget-icons/PriceChart.png",
            width: 800,
            height: 600,
            x: 0,
            y: 0,
            minimized: false,
            maximized: false,
            widgetVersion: "1.0",
            definitionVisible: true,
            singleton: false,
            background: false,
            mobileReady: false,
            descriptorUrl: null,
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
        }
    }
];

export const USER_DASHBOARDS_GET_RESPONSE = {
    dashboards: [USER_DASHBOARD],
    widgets: USER_WIDGETS
};

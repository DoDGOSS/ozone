import { IconName } from "@blueprintjs/icons";


export const WARNING_DIALOG = {
    title: "Usage Notice",
    content:
        `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum eleifend sapien dignissim malesuada. Sed imperdiet augue vitae justo feugiat eget porta est blandit. Proin ipsum ipsum, rutrum ac gravida in, ullamcorper a augue. Sed at scelerisque augue. Morbi scelerisque gravida sapien ut feugiat.</p>` +
        `<p>Donec dictum, nisl commodo dapibus pellentesque, enim quam consectetur quam, at dictum dui augue at risus. Ut id nunc in justo molestie semper. Curabitur magna velit, varius eu porttitor et, tempor pulvinar nulla. Nam at tellus nec felis tincidunt fringilla. Nunc nisi sem, egestas ut consequat eget, luctus et nisi.</p>` +
        `<p>Nulla et lorem odio, vitae pretium ipsum. Integer tellus libero, molestie a feugiat a, imperdiet sit amet metus. Aenean auctor fringilla eros, sit amet suscipit felis eleifend a.</p>`,
    button: {
        text: "I Agree",
        icon: "tick"
    }
};


export const actions = {

    dashboards: {
        button: {
            text: "Dashboards",
            icon: "control" as IconName
        },
        tooltip: {
            title: "Dashboards",
            shortcut: "alt+shift+c",
            description: "Open the Dashboards window to start or manage your Dashboards."
        }
    },

    widgets: {
        button: {
            text: "Widgets",
            icon: "widget" as IconName
        },
        tooltip: {
            title: "Widgets",
            shortcut: "alt+shift+f",
            description: "Open or close the Widgets toolbar to add Widgets to your Dashboard."
        }
    },

    help: {
        button: {
            icon: "help" as IconName
        },
        tooltip: {
            title: "Help",
            shortcut: "alt+shift+h",
            description: "Show the Help window."
        }
    },

    userProfile: {
        button: {
            text: "Test Administrator 1",
            icon: "user" as IconName
        },
        tooltip: {
            title: "User Profile",
            description: "Open the User Profile options window."
        }
    }

};


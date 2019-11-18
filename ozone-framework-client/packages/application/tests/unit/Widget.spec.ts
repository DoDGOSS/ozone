import { widgetFromJson } from "../../src/codecs/Widget.codec";
import { UserWidgetDTO } from "../../src/api/models/UserWidgetDTO";
import { WidgetDTO } from "../../src/api/models/WidgetDTO";
import { userWidgetFromJson } from "../../src/codecs/UserWidget.codec";

describe("UserWidget", () => {
    it("widget property matches widget definition", () => {
        const userWidget = userWidgetFromJson(USER_WIDGET);
        const widget = widgetFromJson(WIDGET);

        expect(widget).toMatchObject(userWidget.widget);
    });
});

const USER_WIDGET: UserWidgetDTO = {
    namespace: "widget",
    path: "eae68158-db89-4722-b371-84e3ffe9f490",
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
};

const WIDGET: WidgetDTO = {
    id: "eae68158-db89-4722-b371-84e3ffe9f490",
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
    },
    path: "eae68158-db89-4722-b371-84e3ffe9f490"
};

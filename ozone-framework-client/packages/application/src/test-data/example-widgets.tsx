import { standardWidgetType } from "./widget-types";
import { Widget } from "../models/Widget";

interface ExampleWidgetProps {
    id: string;
    imageUrl: string;
    title: string;
    universalName: string;
    url: string;
}

function createExampleWidget(props: ExampleWidgetProps): Widget {
    return new Widget({
        height: 400,
        id: props.id,
        images: {
            smallUrl: props.imageUrl,
            largeUrl: props.imageUrl
        },
        intents: {
            send: [],
            receive: []
        },
        isBackground: false,
        isDefinitionVisible: true,
        isMaximized: false,
        isMinimized: false,
        isMobileReady: false,
        isSingleton: false,
        isVisible: true,
        title: props.title,
        types: [standardWidgetType],
        universalName: props.universalName,
        url: props.url,
        width: 400,
        x: 0,
        y: 0
    });
}

export const colorClientWidget = createExampleWidget({
    id: "68626320-8065-45e6-a723-1bf3a140d63c",
    imageUrl: "images/widget-icons/ColorClient.png",
    title: "Color Client",
    universalName: "org.owfgoss.owf.examples.ColorClient",
    url: "http://localhost:4000/color_client.html"
});

export const colorServerWidget = createExampleWidget({
    id: "cf2bdbdd-2a8d-44cb-8442-553e63ff2f1d",
    imageUrl: "images/widget-icons/ColorServer.png",
    title: "Color Server",
    universalName: "org.owfgoss.owf.examples.ColorServer",
    url: "http://localhost:4000/color_server.html"
});

export const channelListenerWidget = createExampleWidget({
    id: "7c66ca9c-10af-4926-affa-6fe2f5e7b544",
    imageUrl: "images/widget-icons/ChannelListener.png",
    title: "Channel Listener",
    url: "http://localhost:4000/channel_listener.html",
    universalName: "org.owfgoss.owf.examples.ChannelListener"
});

export const channelShouterWidget = createExampleWidget({
    id: "156c7f88-9399-4165-b414-1459920a7323",
    imageUrl: "images/widget-icons/ChannelShouter.png",
    title: "Channel Shouter",
    universalName: "org.owfgoss.owf.examples.ChannelShouter",
    url: "http://localhost:4000/channel_shouter.html"
});

export const preferencesWidget = createExampleWidget({
    id: "2bd6a313-0869-4221-929e-142c6d363611",
    imageUrl: "images/widget-icons/Preferences.png",
    title: "Preferences",
    universalName: "org.owfgoss.owf.examples.Preferences",
    url: "http://localhost:4000/preferences.html"
});

export const widgetSearchWidget = createExampleWidget({
    id: "46a7632a-0071-4e99-9cdc-1480aaeca85e",
    imageUrl: "images/widget-icons/WidgetLog.png",
    title: "Widget Search",
    url: "http://localhost:4000/widget_search.html",
    universalName: "org.owfgoss.owf.examples.WidgetSearch"
});

export const EXAMPLE_WIDGETS: Widget[] = [
    colorClientWidget,
    colorServerWidget,
    channelListenerWidget,
    channelShouterWidget,
    preferencesWidget,
    widgetSearchWidget
];

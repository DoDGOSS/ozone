import { Widget, WidgetDefinition } from "./interfaces";

export const colorClientDef: WidgetDefinition = {
    id: "68626320-8065-45e6-a723-1bf3a140d63c",
    title: "Color Client",
    url: "http://localhost:4000/color_client.html",
    universalName: "org.owfgoss.owf.examples.ColorClient"
};

export const colorClient: Widget = {
    id: "c676fb5b-141e-4f71-9d21-0e528f4add78",
    definition: colorClientDef
};

export const colorServerDef: WidgetDefinition = {
    id: "cf2bdbdd-2a8d-44cb-8442-553e63ff2f1d",
    title: "Color Server",
    url: "http://localhost:4000/color_server.html",
    universalName: "org.owfgoss.owf.examples.ColorServer"
};

export const colorServer: Widget = {
    id: "2e571091-8bf2-4c2d-98df-433c38deb4ba",
    definition: colorServerDef
};

export const channelListenerDef: WidgetDefinition = {
    id: "7c66ca9c-10af-4926-affa-6fe2f5e7b544",
    title: "Channel Listener",
    url: "http://localhost:4000/channel_listener.html",
    universalName: "org.owfgoss.owf.examples.ChannelListener"
};

export const channelListener: Widget = {
    id: "2232e371-976e-439a-b8f0-bab127718308",
    definition: channelListenerDef
};

export const channelShouterDef: WidgetDefinition = {
    id: "156c7f88-9399-4165-b414-1459920a7323",
    title: "Channel Shouter",
    url: "http://localhost:4000/channel_shouter.html",
    universalName: "org.owfgoss.owf.examples.ChannelShouter"
};

export const channelShouter: Widget = {
    id: "3d0b4a0c-47cb-4d80-b8d5-583401c312ca",
    definition: channelShouterDef
};

export const preferencesDef: WidgetDefinition = {
    id: "2bd6a313-0869-4221-929e-142c6d363611",
    title: "Preferences",
    url: "http://localhost:4000/preferences.html",
    universalName: "org.owfgoss.owf.examples.Preferences"
};

export const preferences: Widget = {
    id: "118b3ec1-f225-4fc1-a4e8-b3f1e8f7934a",
    definition: preferencesDef
};

export const widgetSearchDef: WidgetDefinition = {
    id: "46a7632a-0071-4e99-9cdc-1480aaeca85e",
    title: "Widget Search",
    url: "http://localhost:4000/widget_search.html",
    universalName: "org.owfgoss.owf.examples.WidgetSearch"
};

export const widgetSearch: Widget = {
    id: "680b9cc1-3433-4dde-85ca-c832e7d24732",
    definition: widgetSearchDef
};

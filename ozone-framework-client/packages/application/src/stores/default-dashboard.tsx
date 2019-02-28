import React from "react";

import { Dashboard, Widget, WidgetDefinition } from "./interfaces";

import { UsersWidget } from "../components/admin/widgets/Users/UsersWidget";
import { GroupsWidget } from "../components/admin/widgets/Groups/GroupsWidget";
import { SystemConfigWidget } from "../components/admin/widgets/SystemConfig/SystemConfigWidget";
import { WidgetsWidget } from "../components/admin/widgets/Widgets/WidgetsWidget";

// widgetAdmin
export const widgetAdminWidgetDef: WidgetDefinition = {
    id: "0b7a39e0-87a2-4077-801b-2e5160fb2287",
    title: "Widget Administration",
    element: <WidgetsWidget />,
    universalName: "org.owfgoss.owf.admin.WidgetAdmin"
};

const widgetAdminWidget: Widget = {
    id: "48edfe94-4291-4991-a648-c19a903a663b",
    definition: widgetAdminWidgetDef
};

// UserAdmin
export const userAdminWidgetDef: WidgetDefinition = {
    id: "105a20c8-f81b-47fb-b683-af3a1cc4ec50",
    title: "User Administration",
    element: <UsersWidget />,
    universalName: "org.owfgoss.owf.admin.UserAdmin"
};

const userAdminWidget: Widget = {
    id: "cad8dc1b-1f33-487c-8d85-21c8aeac5f49",
    definition: userAdminWidgetDef
};

// groupAdmin
export const groupAdminWidgetDef: WidgetDefinition = {
    id: "17a6e77b-304f-47e6-a6be-16143ee3b2fb",
    title: "Group Administration",
    element: <GroupsWidget />,
    universalName: "org.owfgoss.owf.admin.GroupAdmin"
};

const groupAdminWidget: Widget = {
    id: "53a2a879-442c-4012-9215-a17604dedff7",
    definition: groupAdminWidgetDef
};

// sample Widget
export const sampleWidgetDef: WidgetDefinition = {
    id: "483d0022-58c4-4e43-ba48-f7a8f9af0e82",
    title: "Sample Widget",
    element: <h1>Sample</h1>,
    universalName: "org.owfgoss.owf.examples.Sample"
};

export const systemConfigWidgetDef: WidgetDefinition = {
    id: "a224eb26-31bc-466a-bce2-dccb09e5e2e9",
    title: "System Configuration",
    element: <SystemConfigWidget />,
    universalName: "org.owfgoss.owf.admin.SystemConfig"
};

const sampleWidget1: Widget = {
    id: "bb08050a-d3f0-4293-8f94-083d6823f297",
    definition: sampleWidgetDef
};

const colorClientDef: WidgetDefinition = {
    id: "68626320-8065-45e6-a723-1bf3a140d63c",
    title: "Color Client",
    url: "http://localhost:4000/color_client.html",
    universalName: "org.owfgoss.owf.examples.ColorClient"
};

const colorClient: Widget = {
    id: "c676fb5b-141e-4f71-9d21-0e528f4add78",
    definition: colorClientDef
};

const colorServerDef: WidgetDefinition = {
    id: "cf2bdbdd-2a8d-44cb-8442-553e63ff2f1d",
    title: "Color Server",
    url: "http://localhost:4000/color_server.html",
    universalName: "org.owfgoss.owf.examples.ColorServer"
};

const colorServer: Widget = {
    id: "2e571091-8bf2-4c2d-98df-433c38deb4ba",
    definition: colorServerDef
};

export const DEFAULT_DASHBOARD: Dashboard = {
    type: "tile",
    layout: {
        direction: "row",
        splitPercentage: 50,
        first: colorClient.id,
        second: colorServer.id
    },
    widgets: {
        [colorClient.id]: colorClient,
        [colorServer.id]: colorServer
    }
};

export const TILING_DASHBOARD: Dashboard = {
    type: "tile",
    layout: {
        direction: "row",
        splitPercentage: 50,
        first: userAdminWidget.id,
        second: {
            direction: "column",
            splitPercentage: 50,
            first: groupAdminWidget.id,
            second: sampleWidget1.id
        }
    },
    widgets: {
        [userAdminWidget.id]: userAdminWidget,
        [groupAdminWidget.id]: groupAdminWidget,
        [sampleWidget1.id]: sampleWidget1
    }
};

export const FIT_DASHBOARD: Dashboard = {
    type: "fit",
    layout: userAdminWidget.id,
    widgets: {
        [userAdminWidget.id]: userAdminWidget
    }
};

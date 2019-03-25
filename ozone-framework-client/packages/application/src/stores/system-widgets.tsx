import React from "react";

import { Widget, WidgetDefinition } from "./interfaces";

import { GroupsWidget } from "../components/admin/widgets/Groups/GroupsWidget";
import { SystemConfigWidget } from "../components/admin/widgets/SystemConfig/SystemConfigWidget";
import { UsersWidget } from "../components/admin/widgets/Users/UsersWidget";
import { WidgetsWidget } from "../components/admin/widgets/Widgets/WidgetsWidget";
import { DashboardsWidget } from "../components/admin/widgets/Dashboards/DashboardsWidget";

export const widgetAdminWidgetDef: WidgetDefinition = {
    id: "0b7a39e0-87a2-4077-801b-2e5160fb2287",
    title: "Widget Administration",
    element: <WidgetsWidget />,
    universalName: "org.owfgoss.owf.admin.WidgetAdmin"
};

export const widgetAdminWidget: Widget = {
    id: "48edfe94-4291-4991-a648-c19a903a663b",
    definition: widgetAdminWidgetDef
};

export const dashboardAdminWidgetDef: WidgetDefinition = {
    id: "0b7a39e0-87a2-4077-801b-2e5160fb2288",
    title: "Dashboard Administration",
    element: <DashboardsWidget />,
    universalName: "org.owfgoss.owf.admin.DashboardAdmin"
};

export const dashboardAdminWidget: Widget = {
    id: "391dd2af-a207-41a3-8e51-2b20ec3e7241",
    definition: dashboardAdminWidgetDef
};

export const userAdminWidgetDef: WidgetDefinition = {
    id: "105a20c8-f81b-47fb-b683-af3a1cc4ec50",
    title: "User Administration",
    element: <UsersWidget />,
    universalName: "org.owfgoss.owf.admin.UserAdmin"
};

export const userAdminWidget: Widget = {
    id: "cad8dc1b-1f33-487c-8d85-21c8aeac5f49",
    definition: userAdminWidgetDef
};

export const groupAdminWidgetDef: WidgetDefinition = {
    id: "17a6e77b-304f-47e6-a6be-16143ee3b2fb",
    title: "Group Administration",
    element: <GroupsWidget />,
    universalName: "org.owfgoss.owf.admin.GroupAdmin"
};

export const groupAdminWidget: Widget = {
    id: "53a2a879-442c-4012-9215-a17604dedff7",
    definition: groupAdminWidgetDef
};

export const systemConfigWidgetDef: WidgetDefinition = {
    id: "a224eb26-31bc-466a-bce2-dccb09e5e2e9",
    title: "System Configuration",
    element: <SystemConfigWidget />,
    universalName: "org.owfgoss.owf.admin.SystemConfig"
};

export const sampleWidgetDef: WidgetDefinition = {
    id: "483d0022-58c4-4e43-ba48-f7a8f9af0e82",
    title: "Sample Widget",
    element: <h1>Sample</h1>,
    universalName: "org.owfgoss.owf.examples.Sample"
};

export const sampleWidget: Widget = {
    id: "bb08050a-d3f0-4293-8f94-083d6823f297",
    definition: sampleWidgetDef
};

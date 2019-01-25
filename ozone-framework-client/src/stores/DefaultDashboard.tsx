import React from 'react';

import { Dashboard, Widget, WidgetDefinition } from "./DashboardStore";

import { UsersWidget } from "../components/admin/widgets/Users/UsersWidget";
import { GroupsWidget } from "../components/admin/widgets/Groups/GroupsWidget";


export const userAdminWidgetDef: WidgetDefinition = {
    id: "105a20c8-f81b-47fb-b683-af3a1cc4ec50",
    title: "User Administration",
    element: <UsersWidget/>
};

export const groupAdminWidgetDef: WidgetDefinition = {
    id: "17a6e77b-304f-47e6-a6be-16143ee3b2fb",
    title: "Group Administration",
    element: <GroupsWidget/>
};

export const sampleWidgetDef: WidgetDefinition = {
    id: "483d0022-58c4-4e43-ba48-f7a8f9af0e82",
    title: "Sample Widget",
    element: <h1>Sample</h1>
};

const userAdminWidget: Widget = {
    id: "cad8dc1b-1f33-487c-8d85-21c8aeac5f49",
    definition: userAdminWidgetDef
};

const groupAdminWidget: Widget = {
    id: "53a2a879-442c-4012-9215-a17604dedff7",
    definition: groupAdminWidgetDef
};

const sampleWidget1: Widget = {
    id: "bb08050a-d3f0-4293-8f94-083d6823f297",
    definition: sampleWidgetDef
};

export const DEFAULT_DASHBOARD: Dashboard = {
    layout: {
        direction: "row",
        splitPercentage: 50,
        first:'1',
        second: {
            direction: "column",
            splitPercentage: 50,
            first: '2',
            second: '3'
        }
    },
    widgets: {
        ['1']: userAdminWidget,
        ['2']: groupAdminWidget,
        ['3']: sampleWidget1
    }
};

export const LOGIN_DASHBOARD: Dashboard = {
    layout:null,
    widgets: {
        [userAdminWidget.id]: userAdminWidget,
        [groupAdminWidget.id]: groupAdminWidget,
        [sampleWidget1.id]:sampleWidget1
    }
};

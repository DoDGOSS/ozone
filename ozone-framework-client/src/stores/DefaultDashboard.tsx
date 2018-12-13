import React from 'react';

import { Dashboard, Widget, WidgetDefinition } from "./DashboardStore";

import { UsersWidget } from "../components/admin/widgets/Users/UsersWidget";


const userAdminWidgetDef: WidgetDefinition = {
    id: "105a20c8-f81b-47fb-b683-af3a1cc4ec50",
    title: "User Administration",
    element: <UsersWidget/>
};

const sampleWidgetDef: WidgetDefinition = {
    id: "483d0022-58c4-4e43-ba48-f7a8f9af0e82",
    title: "Sample Widget",
    element: <h1>Sample</h1>
};

const userAdminWidget: Widget = {
    id: "cad8dc1b-1f33-487c-8d85-21c8aeac5f49",
    definition: userAdminWidgetDef
};

const sampleWidget1: Widget = {
    id: "195c84bd-2b42-4b28-853a-c0acee30d746",
    definition: sampleWidgetDef
};

const sampleWidget2: Widget = {
    id: "bb08050a-d3f0-4293-8f94-083d6823f297",
    definition: sampleWidgetDef
};

const sampleWidget3: Widget = {
    id: "5610f73b-7100-4566-97b1-287c852382d3",
    definition: sampleWidgetDef
};

export const DEFAULT_DASHBOARD: Dashboard = {
    layout: {
        direction: "row",
        splitPercentage: 33,
        first: userAdminWidget.id,
        second: {
            direction: "row",
            splitPercentage: 50,
            first: sampleWidget1.id,
            second: {
                direction: "column",
                splitPercentage: 50,
                first: sampleWidget2.id,
                second: sampleWidget3.id
            }
        }
    },
    widgets: {
        [userAdminWidget.id]: userAdminWidget,
        [sampleWidget1.id]: sampleWidget1,
        [sampleWidget2.id]: sampleWidget2,
        [sampleWidget3.id]: sampleWidget3
    }
};

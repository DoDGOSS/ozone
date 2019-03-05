import React from "react";

import { Dashboard } from "./interfaces";
import {
    channelListener,
    channelShouter,
    colorClient,
    colorServer,
    preferences,
    widgetSearch
} from "./example-widgets";
import { groupAdminWidget, sampleWidget, userAdminWidget } from "./system-widgets";

export const DEFAULT_DASHBOARD: Dashboard = {
    type: "tile",
    layout: null,
    widgets: {}
};

export const EXAMPLE_WIDGET_DASHBOARD: Dashboard = {
    type: "tile",
    layout: {
        direction: "row",
        splitPercentage: 50,
        first: {
            direction: "column",
            splitPercentage: 50,
            first: widgetSearch.id,
            second: preferences.id
        },
        second: {
            direction: "column",
            splitPercentage: 25,
            first: {
                direction: "row",
                splitPercentage: 50,
                first: colorClient.id,
                second: colorServer.id
            },
            second: {
                direction: "column",
                splitPercentage: 35,
                first: channelShouter.id,
                second: channelListener.id
            }
        }
    },
    widgets: {
        [colorClient.id]: colorClient,
        [colorServer.id]: colorServer,
        [preferences.id]: preferences,
        [channelShouter.id]: channelShouter,
        [channelListener.id]: channelListener,
        [widgetSearch.id]: widgetSearch
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
            second: sampleWidget.id
        }
    },
    widgets: {
        [userAdminWidget.id]: userAdminWidget,
        [groupAdminWidget.id]: groupAdminWidget,
        [sampleWidget.id]: sampleWidget
    }
};

export const FIT_DASHBOARD: Dashboard = {
    type: "fit",
    layout: userAdminWidget.id,
    widgets: {
        [userAdminWidget.id]: userAdminWidget
    }
};

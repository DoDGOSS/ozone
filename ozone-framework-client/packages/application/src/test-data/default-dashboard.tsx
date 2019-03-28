import React from "react";

import { Dashboard } from "../models/dashboard/Dashboard";
import { TabbedPanel } from "../models/dashboard/TabbedPanel";
import { FitPanel } from "../models/dashboard/FitPanel";
import { ExpandoPanel } from "../models/dashboard/ExpandoPanel";
import { DashboardNode } from "../components/widget-dashboard/types";

import {
    channelListenerWidget,
    channelShouterWidget,
    colorClientWidget,
    colorServerWidget,
    preferencesWidget,
    widgetSearchWidget
} from "./example-widgets";
import { groupAdminWidget, userAdminWidget } from "./admin-widgets";
import { createUserWidget } from "./user-widget";

const _search = createUserWidget({
    id: 1,
    position: 0,
    widget: widgetSearchWidget
});

const _preferences = createUserWidget({
    id: 2,
    position: 1,
    widget: preferencesWidget
});

const _colorClient = createUserWidget({
    id: 3,
    position: 2,
    widget: colorClientWidget
});

const _colorServer = createUserWidget({
    id: 4,
    position: 3,
    widget: colorServerWidget
});

const _channelShouter = createUserWidget({
    id: 5,
    position: 4,
    widget: channelShouterWidget
});

const _channelListener = createUserWidget({
    id: 6,
    position: 5,
    widget: channelListenerWidget
});

const _userAdmin = createUserWidget({
    id: 7,
    position: 6,
    widget: userAdminWidget
});

const _groupAdmin = createUserWidget({
    id: 8,
    position: 7,
    widget: groupAdminWidget
});

export const SAMPLE_DASHBOARD: Dashboard = (() => {
    const tabbedPanel = new TabbedPanel(null, "My Tabbed Panel", [_userAdmin, _groupAdmin]);

    const fitPanel = new FitPanel(null, _search);

    const accordionPanel = new ExpandoPanel(null, "My Accordion Panel", "accordion", [_colorClient, _colorServer]);

    const portalPanel = new ExpandoPanel(null, "My Portal Panel", "portal", [
        _channelListener,
        _channelShouter,
        _preferences
    ]);

    const tree: DashboardNode = {
        direction: "row",
        splitPercentage: 50,
        first: {
            direction: "column",
            splitPercentage: 50,
            first: tabbedPanel.id,
            second: fitPanel.id
        },
        second: {
            direction: "column",
            splitPercentage: 50,
            first: accordionPanel.id,
            second: portalPanel.id
        }
    };

    return new Dashboard(tree, [tabbedPanel, fitPanel, accordionPanel, portalPanel]);
})();

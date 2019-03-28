import { DashboardNode } from "../types";

import { Dashboard } from "./Dashboard";
import { ExpandoPanel } from "./ExpandoPanel";
import { FitPanel } from "./FitPanel";
import { ObservableWidget } from "./ObservableWidget";
import { TabbedPanel } from "./TabbedPanel";

import { groupAdminWidget, userAdminWidget } from "../../../stores/system-widgets";

import {
    channelListener,
    channelShouter,
    colorClient,
    colorServer,
    preferences,
    widgetSearch
} from "../../../stores/example-widgets";

export const SAMPLE_DASHBOARD: Dashboard = (() => {
    const tabbedPanel = new TabbedPanel(null, "My Tabbed Panel", [
        ObservableWidget.fromWidget(userAdminWidget),
        ObservableWidget.fromWidget(groupAdminWidget)
    ]);

    const fitPanel = new FitPanel(null, ObservableWidget.fromWidget(widgetSearch));

    const accordionPanel = new ExpandoPanel(null, "My Accordion Panel", "accordion", [
        ObservableWidget.fromWidget(colorClient),
        ObservableWidget.fromWidget(colorServer)
    ]);

    const portalPanel = new ExpandoPanel(null, "My Portal Panel", "portal", [
        ObservableWidget.fromWidget(channelListener),
        ObservableWidget.fromWidget(channelShouter),
        ObservableWidget.fromWidget(preferences)
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

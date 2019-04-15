import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { dashboardStore, DashboardStore } from "./DashboardStore";
import { LayoutType, Panel, PanelState } from "../models/dashboard/types";
import { DashboardNode, DashboardPath } from "../components/widget-dashboard/types";
import { Dashboard } from "../models/dashboard/Dashboard";

import { FitPanel } from "../models/dashboard/FitPanel";
import { TabbedPanel } from "../models/dashboard/TabbedPanel";
import { ExpandoPanel } from "../models/dashboard/ExpandoPanel";
import { UserWidget } from "../models/UserWidget";

import { WidgetLaunchArgs } from "../services/WidgetLaunchArgs";

import { isNil, Predicate, values } from "../utility";

export class DashboardService {
    private readonly store: DashboardStore;

    private readonly isConfirmationDialogVisible$ = new BehaviorSubject(false);
    private replaceWidgetCallback?: () => void;

    constructor(store?: DashboardStore) {
        this.store = store || dashboardStore;
    }

    isConfirmationDialogVisible = () => asBehavior(this.isConfirmationDialogVisible$);

    showConfirmationDialog = (callback: () => void) => {
        this.isConfirmationDialogVisible$.next(true);
        this.replaceWidgetCallback = callback;
    };

    cancelReplaceWidget = () => {
        this.isConfirmationDialogVisible$.next(false);

        this.replaceWidgetCallback = undefined;
    };

    confirmReplaceWidget = () => {
        this.isConfirmationDialogVisible$.next(false);

        if (this.replaceWidgetCallback) this.replaceWidgetCallback();
        this.replaceWidgetCallback = undefined;
    };

    getCurrentDashboard = (): Dashboard => {
        const dashboard = this.store.currentDashboard().value;
        if (dashboard === null) {
            throw new Error("No Dashboard is available");
        }
        return dashboard;
    };

    setLayout = (tree: DashboardNode | null) => {
        this.getCurrentDashboard().setLayout(tree);
    };

    setLayoutFast = (tree: DashboardNode | null) => {
        this.getCurrentDashboard().setLayoutFast(tree);
    };

    setPanelLayout = (panel: Panel<PanelState>, path: DashboardPath, layout: LayoutType) => {
        this.getCurrentDashboard().setPanelLayout(panel, path, layout);
    };

    /**
     * Add a UserWidget to the current Dashboard
     *
     * @returns true -- if the Widget was opened successfully
     */
    addWidget(widget: UserWidget, title?: string): boolean {
        return this.getCurrentDashboard().addWidget(widget, title);
    }

    /**
     * Find and launch a Widget (for the Widget Launcher API)
     *
     * @returns true -- if the Widget was launched successfully
     */
    launchWidget(args: WidgetLaunchArgs): boolean {
        const userState = dashboardStore.userDashboards().value;
        const userWidgets = values(userState.widgets);

        const widget = userWidgets.find(byGuidOrUniversalName(args.guid, args.universalName));
        if (!widget) return false;

        widget.launchData = args.data;

        return this.addWidget(widget, args.title);
    }

    addLayout_TEMP = (layout: LayoutType) => {
        const dashboard = this.getCurrentDashboard();

        switch (layout) {
            case "fit":
                dashboard.addPanel(createSampleFitPanel());
                break;

            case "tabbed":
                dashboard.addPanel(createSampleTabbedPanel());
                break;

            case "accordion":
                dashboard.addPanel(createSampleAccordionPanel());
                break;

            case "portal":
                dashboard.addPanel(createSamplePortalPanel());
                break;
        }
    };
}

function byGuidOrUniversalName(guid?: string, universalName?: string): Predicate<UserWidget> {
    return (userWidget: UserWidget) =>
        (!isNil(guid) && userWidget.widget.id === guid) ||
        (!isNil(universalName) && userWidget.widget.universalName === universalName);
}

function createSampleFitPanel(): FitPanel {
    return new FitPanel();
}

function createSampleTabbedPanel(): TabbedPanel {
    return new TabbedPanel(null, "New Tabbed Panel", []);
}

function createSampleAccordionPanel(): ExpandoPanel {
    return new ExpandoPanel("accordion", null, "New Accordion Panel", []);
}

function createSamplePortalPanel(): ExpandoPanel {
    return new ExpandoPanel("portal", null, "New Portal Panel", []);
}

export const dashboardService = new DashboardService();

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

    setPanelLayout = (panel: Panel<PanelState>, path: DashboardPath, layout: LayoutType) => {
        this.getCurrentDashboard().setPanelLayout(panel, path, layout);
    };

    addWidget = (widget: UserWidget) => {
        this.getCurrentDashboard().addWidget(widget);
    };

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

function createSampleFitPanel(): FitPanel {
    return new FitPanel(null, null);
}

function createSampleTabbedPanel(): TabbedPanel {
    return new TabbedPanel(null, "New Tabbed Panel", []);
}

function createSampleAccordionPanel(): ExpandoPanel {
    return new ExpandoPanel(null, "New Accordion Panel", "accordion", []);
}

function createSamplePortalPanel(): ExpandoPanel {
    return new ExpandoPanel(null, "New Portal Panel", "portal", []);
}

export const dashboardService = new DashboardService();

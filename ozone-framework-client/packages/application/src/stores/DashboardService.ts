import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { DashboardNode, Widget } from "./interfaces";
import { dashboardStore, DashboardStore } from "./DashboardStore";
import { LayoutType, Panel, PanelState } from "../components/widget-dashboard/model/types";
import { DashboardPath } from "../components/widget-dashboard/types";
import { Dashboard } from "../components/widget-dashboard/model/Dashboard";

import uuid from "uuid/v4";
import { colorClientDef, colorServerDef } from "./example-widgets";
import { FitPanel } from "../components/widget-dashboard/model/FitPanel";
import { TabbedPanel } from "../components/widget-dashboard/model/TabbedPanel";
import { ObservableWidget } from "../components/widget-dashboard/model/ObservableWidget";
import { Tab } from "@blueprintjs/core";
import { ExpandoPanel } from "../components/widget-dashboard/model/ExpandoPanel";

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
        const dashboard = this.store.currentDashboard();
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

    addWidget = (widget: Widget) => {
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
    const widget = ObservableWidget.fromWidget({
        id: uuid(),
        definition: colorClientDef
    });

    return new FitPanel(null, widget);
}

function createSampleTabbedPanel(): TabbedPanel {
    const widgets = [
        ObservableWidget.fromWidget({
            id: uuid(),
            definition: colorClientDef
        }),
        ObservableWidget.fromWidget({
            id: uuid(),
            definition: colorServerDef
        })
    ];

    return new TabbedPanel(null, "New Tabbed Panel", widgets);
}

function createSampleAccordionPanel(): ExpandoPanel {
    const widgets = [
        ObservableWidget.fromWidget({
            id: uuid(),
            definition: colorClientDef
        }),
        ObservableWidget.fromWidget({
            id: uuid(),
            definition: colorServerDef
        })
    ];

    return new ExpandoPanel(null, "New Accordion Panel", "accordion", widgets);
}

function createSamplePortalPanel(): ExpandoPanel {
    const widgets = [
        ObservableWidget.fromWidget({
            id: uuid(),
            definition: colorClientDef
        }),
        ObservableWidget.fromWidget({
            id: uuid(),
            definition: colorServerDef
        })
    ];

    return new ExpandoPanel(null, "New Portal Panel", "portal", widgets);
}

export const dashboardService = new DashboardService();

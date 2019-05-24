import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { MosaicDropTargetPosition, MosaicPath } from "../features/MosaicDashboard";

import { dashboardStore, DashboardStore } from "./DashboardStore";
import { ExpandoPanel, FitPanel, LayoutType, Panel, PanelState, TabbedPanel } from "../models/panel";
import { DashboardNode, DashboardPath } from "../components/widget-dashboard/types";
import { Dashboard } from "../models/Dashboard";
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
    addWidget(userWidget: UserWidget, title?: string): boolean {
        return this.getCurrentDashboard().addWidget({ userWidget, title });
    }

    /**
     * Add a UserWidget by Widget ID to the current Dashboard
     *
     * @returns true -- if the Widget was opened successfully
     */
    addUserWidgetById(id: number, path?: MosaicPath, position?: MosaicDropTargetPosition): boolean {
        const userWidget = dashboardStore.findUserWidgetById(id);
        if (!userWidget) return false;

        return this.getCurrentDashboard().addWidget({ userWidget, path, position });
    }

    /**
     * Find and launch a Widget (for the Widget Launcher API)
     *
     * @returns true -- if the Widget was launched successfully
     */
    launchWidget(args: WidgetLaunchArgs): boolean {
        const userWidget = findUserWidget(byGuidOrUniversalName(args.guid, args.universalName));
        if (!userWidget) return false;

        userWidget.launchData = args.data;

        return this.addWidget(userWidget, args.title);
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

function findUserWidget(predicate: Predicate<UserWidget>): UserWidget | undefined {
    const userState = dashboardStore.userDashboards().value;
    const userWidgets = values(userState.widgets);

    return userWidgets.find(predicate);
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
    return new TabbedPanel({ title: "New Tabbed Panel" });
}

function createSampleAccordionPanel(): ExpandoPanel {
    return new ExpandoPanel("accordion", { title: "New Accordion Panel" });
}

function createSamplePortalPanel(): ExpandoPanel {
    return new ExpandoPanel("portal", { title: "New Portal Panel" });
}

export const dashboardService = new DashboardService();

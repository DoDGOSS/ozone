import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { dashboardStore, DashboardStore } from "../stores/DashboardStore";
import { ExpandoPanel, FitPanel, LayoutType, Panel, PanelState, TabbedPanel } from "../models/panel";
import { DashboardNode, DashboardPath } from "../components/widget-dashboard/types";
import { AddWidgetOpts, Dashboard, DashboardProps } from "../models/Dashboard";
import { UserWidget } from "../models/UserWidget";

import { WidgetLaunchArgs } from "./WidgetLaunchArgs";

import { isNil, Predicate, values } from "../utility";
import { MosaicPath } from "../features/MosaicDashboard/types";
import { MosaicDropTargetPosition } from "../shared/dragAndDrop";
import { errorStore } from "./ErrorStore";

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

    private get dashboard(): Dashboard {
        return this.store.currentDashboard().value;
    }

    private get dashboardState(): DashboardProps {
        return this.dashboard.state().value;
    }

    getPanelByPath(path: MosaicPath): Panel | null {
        return this.dashboard.getPanelByPath(path);
    }

    findPanelByWidgetId(instanceId: string): Panel | null {
        const dashboard = this.store.currentDashboard().value;
        if (dashboard === null) return null;

        const panels = dashboard.state().value.panels;
        for (const panel of values(panels)) {
            if (panel.findWidget(instanceId)) return panel;
        }

        return null;
    }

    setLayout = (tree: DashboardNode | null) => {
        this.dashboard.setLayout(tree);
    };

    setLayoutFast = (tree: DashboardNode | null) => {
        this.dashboard.setLayoutFast(tree);
    };

    setPanelLayout = (panel: Panel<PanelState>, path: DashboardPath, layout: LayoutType) => {
        this.dashboard.setPanelLayout(panel, path, layout);
    };

    /**
     * Add a UserWidget or WidgetInstance to the current Dashboard
     *
     * @returns true -- if the Widget was opened successfully
     */
    addWidget(opts: AddWidgetOpts): boolean {
        if (this.dashboardState.isLocked) {
            errorStore.notice("Dashboard Locked", "The current Dashboard is locked and Widgets may not be added.");
            return false;
        }

        return this.dashboard.addWidget(opts);
    }

    /**
     * Add a UserWidget by Widget ID to the current Dashboard
     *
     * @returns true -- if the Widget was opened successfully
     */
    addUserWidgetById(id: number, path?: MosaicPath, position?: MosaicDropTargetPosition): boolean {
        const userWidget = dashboardStore.findUserWidgetById(id);
        if (!userWidget) return false;

        return this.addWidget({ widget: userWidget, path, position });
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

        return this.addWidget({ widget: userWidget, title: args.title });
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

import { Subscription } from "rxjs";

import { UserState } from "../codecs/Dashboard.codec";
import { Dashboard, DashboardProps } from "../models/Dashboard";
import { Panel, PanelState } from "../models/panel";
import { PanelId, WidgetInstanceId } from "../models/types";
import { WidgetInstance } from "../models/WidgetInstance";
import { byId, includes, integerKeys, mapValues, sortedKeys, values } from "../utility";

import { dashboardStore } from "./DashboardStore";
import { ImmerStore } from "./ImmerStore";
import { DesktopState, toDashboardRef, toPanelRef, toUserWidgetRef, toWidgetInstanceRef } from "./immutable-model";

const defaultState: DesktopState = {
    isLoading: true,

    userWidgets: {},
    userWidgetIds: [],

    dashboards: {},
    dashboardIds: [],
    currentDashboardId: "",

    panels: {},
    panelIds: [],

    widgetInstances: {},
    widgetInstanceIds: []
};

/**
 * An interim step to correct the mess of Observables in the Dashboards & Panels.
 *
 * The data in the store should be normalized, rather than in deeply nested structures.
 * See: https://redux.js.org/faq/organizing-state#how-do-i-organize-nested-or-duplicate-data-in-my-state
 *
 * The data should also be immutable. Using a library like immerjs makes this relatively easy, "diff"-ing the produced
 * state to only update the required items, making it easier for React to detect differences and skip unneeded
 * re-renders.
 *
 * Finally, each store should have a single top-level state / observable. At the very least, the observables should
 * not be nested like the Dashboards & Panels. It became too difficult to monitor for updates within the UI.
 */
export class DesktopStore extends ImmerStore<DesktopState> {
    private subscription?: Subscription;
    private panelSubscriptions: Dictionary<Subscription> = {};

    constructor(initialState?: DesktopState) {
        super(initialState || defaultState);

        // Until actions happen in DesktopStore (or DesktopService), monitor and get our state from the DashboardStore.
        dashboardStore.isLoading().subscribe(this.updateIsLoading.bind(this));
        dashboardStore.userDashboards().subscribe(this.updateUserState.bind(this));
        dashboardStore.currentDashboard().subscribe(this.updateCurrentDashboard.bind(this));
    }

    private updateIsLoading(isLoading: boolean): void {
        this.next((desktop) => {
            desktop.isLoading = isLoading;
        });
    }

    private updateUserState(update: UserState): void {
        this.next((desktop) => {
            desktop.dashboards = mapValues(update.dashboards, toDashboardRef);
            desktop.dashboardIds = sortedKeys(update.dashboards);

            desktop.userWidgets = mapValues(update.widgets, toUserWidgetRef);
            desktop.userWidgetIds = integerKeys(update.widgets);

            const panels = getPanels(update);
            values(panels).forEach((panel) => addPanel(desktop, panel));
        });
    }

    private updateCurrentDashboard(dashboard: Dashboard): void {
        this.subscribeToDashboard(dashboard);
        this.subscribeToPanels(dashboard.state().value.panels);

        this.next((desktop) => {
            desktop.currentDashboardId = dashboard.guid;
        });
    }

    private updateCurrentDashboardState(nextDashboard: DashboardProps): void {
        this.next((desktop) => {
            const dashboard = desktop.dashboards[nextDashboard.guid];
            if (!dashboard) return;

            const prevPanelIds = dashboard.panelIds;
            const nextPanelIds = values(nextDashboard.panels)
                .map(byId)
                .sort();

            dashboard.panelIds = nextPanelIds;

            const addedPanels = values(nextDashboard.panels).filter((p) => !includes(prevPanelIds, p.id));
            const removedPanelIds = prevPanelIds.filter((id) => !includes(nextPanelIds, id));

            removedPanelIds.forEach((id) => {
                removePanel(desktop, id);

                const subscription = this.panelSubscriptions[id];
                if (subscription) {
                    subscription.unsubscribe();
                    delete this.panelSubscriptions[id];
                }
            });

            addedPanels.forEach((panel) => {
                addPanel(desktop, panel);

                this.panelSubscriptions[panel.id] = panel.state().subscribe(this.updatePanelState.bind(this));
            });
        });
    }

    private updatePanelState(nextPanel: PanelState): void {
        this.next((desktop) => {
            const panel = desktop.panels[nextPanel.id];
            if (!panel) return;

            const prevInstanceIds = panel.widgetInstanceIds;
            const nextInstanceIds = nextPanel.widgets.map(byId).sort();

            panel.widgetInstanceIds = nextInstanceIds;

            const addedInstances = nextPanel.widgets.filter((wi) => !includes(prevInstanceIds, wi.id));
            const removedInstanceIds = prevInstanceIds.filter((id) => !includes(nextInstanceIds, id));

            removedInstanceIds.forEach((id) => removeWidgetInstance(desktop, id));
            addedInstances.forEach((added) => addWidgetInstance(desktop, added));
        });
    }

    private subscribeToDashboard(dashboard: Dashboard): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = dashboard.state().subscribe(this.updateCurrentDashboardState.bind(this));
    }

    private subscribeToPanels(panels: Dictionary<Panel>): void {
        values(this.panelSubscriptions).forEach((s) => s.unsubscribe());

        this.panelSubscriptions = mapValues(panels, (panel) =>
            panel.state().subscribe(this.updatePanelState.bind(this))
        );
    }
}

let _desktopStore: DesktopStore | undefined;

export function desktopStore(): DesktopStore {
    if (!_desktopStore) {
        _desktopStore = new DesktopStore();
    }
    return _desktopStore;
}

function addPanel(desktop: DesktopState, panel: Panel): void {
    const panelState = panel.state().value;

    desktop.panelIds.push(panelState.id);
    desktop.panelIds.sort();
    desktop.panels[panel.id] = toPanelRef(panelState);

    for (const instance of panelState.widgets) {
        addWidgetInstance(desktop, instance);
    }
}

function removePanel(desktop: DesktopState, id: PanelId): void {
    const panelRef = desktop.panels[id];
    if (!panelRef) return;
    for (const instanceId of panelRef.widgetInstanceIds) {
        removeWidgetInstance(desktop, instanceId);
    }

    const idx = desktop.panelIds.findIndex((p) => p === id);
    if (idx >= 0) {
        desktop.panelIds.splice(idx, 1);
        delete desktop.panels[id];
    }
}

function addWidgetInstance(desktop: DesktopState, instance: WidgetInstance): void {
    desktop.widgetInstanceIds.push(instance.id);
    desktop.widgetInstanceIds.sort();
    desktop.widgetInstances[instance.id] = toWidgetInstanceRef(instance);
}

function removeWidgetInstance(desktop: DesktopState, id: WidgetInstanceId): void {
    const idx = desktop.widgetInstanceIds.findIndex((wi) => wi === id);
    if (idx >= 0) {
        desktop.widgetInstanceIds.splice(idx, 1);
        delete desktop.widgetInstances[id];
    }
}

function getPanels(state: UserState): Dictionary<Panel> {
    const panels: Dictionary<Panel> = {};
    for (const dashboard of values(state.dashboards)) {
        for (const panel of values(dashboard.state().value.panels)) {
            panels[panel.id] = panel;
        }
    }
    return panels;
}

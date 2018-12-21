import { action, computed, observable, runInAction } from "mobx";
import { injectable } from "../inject";

import { MosaicNode } from 'react-mosaic-component';
import { DEFAULT_DASHBOARD } from "./DefaultDashboard";


export interface WidgetDefinition {
    id: string;
    title: string;
    element: JSX.Element;
}


export interface Widget {
    id: string;
    definition: WidgetDefinition;
}


export type DashboardNode = MosaicNode<string>;

export type WidgetMap = { [id: string]: Widget };

export interface Dashboard {
    layout: DashboardNode | null;
    widgets: WidgetMap;
}


@injectable()
export class DashboardStore {

    @observable
    dashboard: Dashboard | undefined;

    @computed
    get layout(): DashboardNode | null {
        return this.dashboard ? this.dashboard.layout : null;
    }

    @computed
    get widgets(): WidgetMap | null {
        return this.dashboard ? this.dashboard.widgets : null;
    }

    constructor() {
        runInAction("initialize", () => {
            this.dashboard = DEFAULT_DASHBOARD;
        });
    }

    @action.bound
    setDashboard(dashboard: Dashboard | undefined) {
        this.dashboard = dashboard;
    }

    @action.bound
    setLayout(dashboardNode: DashboardNode | null) {
        if (!this.dashboard) return;
        this.dashboard.layout = dashboardNode;
    }

}

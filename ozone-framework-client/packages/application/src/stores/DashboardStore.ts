import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { Dashboard } from "./interfaces";

import { DEFAULT_DASHBOARD } from "./default-dashboard";
// import { EXAMPLE_WIDGET_DASHBOARD } from "./default-dashboard";
// import { TILING_DASHBOARD } from "./default-dashboard";
// import { FIT_DASHBOARD } from "./default-dashboard";

export class DashboardStore {
    // "EXAMPLE_WIDGET_DASHBOARD" for example widgets, "TILING_DASHBOARD" for tiling layout, "FIT_DASHBOARD" for fit layout
    private readonly dashboard$ = new BehaviorSubject<Dashboard | null>(DEFAULT_DASHBOARD);

    dashboard = () => asBehavior(this.dashboard$);

    currentDashboard = () => this.dashboard$.value;

    setDashboard = (dashboard: Dashboard | null) => this.dashboard$.next(dashboard);
}

export const dashboardStore = new DashboardStore();

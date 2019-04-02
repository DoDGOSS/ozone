import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { Dashboard, EMPTY_DASHBOARD } from "../components/widget-dashboard/model/Dashboard";

export class DashboardStore {
    private readonly dashboard$ = new BehaviorSubject<Dashboard>(EMPTY_DASHBOARD);

    dashboard = () => asBehavior(this.dashboard$);

    currentDashboard = () => this.dashboard$.value;

    setDashboard = (dashboard: Dashboard) => this.dashboard$.next(dashboard);
}

export const dashboardStore = new DashboardStore();

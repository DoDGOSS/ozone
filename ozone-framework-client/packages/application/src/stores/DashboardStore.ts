import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { Dashboard, EMPTY_DASHBOARD } from "../models/dashboard/Dashboard";
import { DashboardCreateOpts, userDashboardApi, UserDashboardAPI } from "../api/clients/UserDashboardAPI";
import { dashboardApi, DashboardAPI } from "../api/clients/DashboardAPI";
import { dashboardToUpdateRequest, deserializeUserState, UserState } from "../codecs/Dashboard.codec";
import { CreateDashboardOptions } from "../components/create-dashboard-screen/CreateDashboardForm";
import { createPresetLayout } from "./default-layouts";

import { isNil, values } from "../utility";

const EMPTY_USER_DASHBOARDS_STATE: UserState = {
    dashboards: {},
    stacks: {},
    widgets: {}
};

export class DashboardStore {
    private readonly userDashboardApi: UserDashboardAPI;
    private readonly dashboardApi: DashboardAPI;

    private readonly userDashboards$ = new BehaviorSubject<UserState>(EMPTY_USER_DASHBOARDS_STATE);
    private readonly currentDashboard$ = new BehaviorSubject<Dashboard>(EMPTY_DASHBOARD);

    private readonly isLoading$ = new BehaviorSubject(true);

    constructor(userDashboards?: UserDashboardAPI, dashboards?: DashboardAPI) {
        this.userDashboardApi = userDashboards || userDashboardApi;
        this.dashboardApi = dashboards || dashboardApi;
    }

    userDashboards = () => asBehavior(this.userDashboards$);

    currentDashboard = () => asBehavior(this.currentDashboard$);

    isLoading = () => asBehavior(this.isLoading$);

    fetchUserDashboards = async (newCurrentGuid?: string) => {
        this.isLoading$.next(true);

        let response = await this.userDashboardApi.getOwnDashboards();
        if (response.status !== 200) {
            throw new Error("Failed to fetch user dashboards");
        }

        if (response.data.dashboards.length === 0) {
            response = await this.createDefaultDashboard();
        }

        const userDashboards = deserializeUserState(response.data.dashboards, response.data.widgets);
        this.updateUserState(userDashboards, newCurrentGuid);

        this.isLoading$.next(false);
    };

    createDefaultDashboard = async () => {
        const createResponse = await this.userDashboardApi.createDefaultDashboard();
        if (createResponse.status !== 200) {
            throw new Error("Failed to create default dashboard");
        }

        const refetchResponse = await this.userDashboardApi.getOwnDashboards();
        if (refetchResponse.status !== 200) {
            throw new Error("Failed to fetch user dashboards");
        }

        return refetchResponse;
    };

    createDashboard = async (dashboard: CreateDashboardOptions) => {
        const { tree, panels } = createPresetLayout(dashboard.presetLayoutName);

        const opts: DashboardCreateOpts = {
            name: dashboard.name,
            tree,
            panels
        };

        const createResponse = await this.userDashboardApi.createDashboard(opts);
        if (createResponse.status !== 200) {
            throw new Error("Failed to create new dashboard");
        }

        const createdDashboard = createResponse.data;

        await this.fetchUserDashboards(createdDashboard.guid);
    };

    saveCurrentDashboard = async () => {
        const currentDashboard = this.currentDashboard$.value;
        if (currentDashboard === null) return;

        const request = dashboardToUpdateRequest(currentDashboard);

        const response = await this.dashboardApi.updateDashboard(request);

        if (response.status !== 200) {
            throw new Error("Failed to save user dashboard");
        }
    };

    private updateUserState = (state: UserState, newCurrentGuid?: string) => {
        this.userDashboards$.next(state);

        const currentDashboard = this.currentDashboard$.value;
        const dashboards = values(state.dashboards);

        if (dashboards.length <= 0) {
            this.currentDashboard$.next(EMPTY_DASHBOARD);
            return;
        }

        if (currentDashboard === null) {
            this.currentDashboard$.next(dashboards[0]);
            return;
        }

        const currentGuid = !isNil(newCurrentGuid) ? newCurrentGuid : currentDashboard.guid;
        const newCurrentDashboard = dashboards.find((dashboard) => dashboard.guid === currentGuid);
        if (newCurrentDashboard === undefined) {
            this.currentDashboard$.next(dashboards[0]);
            return;
        }

        this.currentDashboard$.next(newCurrentDashboard);
    };
}

export const dashboardStore = new DashboardStore();
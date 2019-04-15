import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";
import { UserDashboardsGetResponse, validateUserDashboardsGetResponse } from "../models/UserDashboardDTO";
import { DashboardDTO, validateDashboard } from "../models/DashboardDTO";
import { dashboardLayoutToJson } from "../../codecs/Dashboard.codec";
import { DashboardLayout } from "../../models/dashboard/Dashboard";

import { isNil, uuid } from "../../utility";

export class UserDashboardAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getOwnDashboards(): Promise<Response<UserDashboardsGetResponse>> {
        return this.gateway.get("person/me/", {
            validate: validateUserDashboardsGetResponse
        });
    }

    async createDefaultDashboard(): Promise<Response<DashboardDTO>> {
        return this.createDashboard({
            name: "Untitled",
            tree: null,
            panels: {},
            isDefault: true
        });
    }

    async createDashboard(opts: DashboardCreateOpts): Promise<Response<DashboardDTO>> {
        const stack = {
            name: opts.name
        };

        const dashboard = {
            name: opts.name,
            guid: uuid(),
            isdefault: !isNil(opts.isDefault) ? opts.isDefault : false,
            state: [],
            layoutConfig: dashboardLayoutToJson({
                tree: opts.tree || null,
                panels: opts.panels || {}
            }),
            publishedToStore: false
        };

        const requestData = qs.stringify({
            _method: "POST",
            adminEnabled: false,
            tab: "dashboards",
            update_action: "createAndAddDashboard",
            stackData: JSON.stringify(stack),
            dashboardData: JSON.stringify(dashboard)
        });

        return this.gateway.post("stack/addPage/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboard
        });
    }
}

export const userDashboardApi = new UserDashboardAPI();

export interface DashboardCreateOpts extends DashboardLayout {
    name: string;
    isDefault?: boolean;
}

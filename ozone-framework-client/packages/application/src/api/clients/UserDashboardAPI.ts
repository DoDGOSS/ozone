import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";
import { UserDashboardsGetResponse, validateUserDashboardsGetResponse } from "../models/UserDashboardDTO";
import { DashboardDTO, validateDashboard } from "../models/DashboardDTO";

import { uuid } from "../../utility";

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
        const defaultStack = {
            name: "Untitled"
        };

        const defaultDashboard = {
            name: "Untitled",
            guid: uuid(),
            isdefault: true,
            state: [],
            layoutConfig: {},
            publishedToStore: true
        };

        const requestData = qs.stringify({
            _method: "POST",
            adminEnabled: false,
            tab: "dashboards",
            update_action: "createAndAddDashboard",
            stackData: JSON.stringify(defaultStack),
            dashboardData: JSON.stringify(defaultDashboard)
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

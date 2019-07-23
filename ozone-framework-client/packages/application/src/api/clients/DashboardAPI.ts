import * as qs from "qs";
import { isNil } from "lodash";

import { Gateway, getGateway, Response } from "../interfaces";

import {
    DashboardDTO,
    DashboardGetResponse,
    DashboardUpdateParams,
    DashboardUpdateRequest,
    DashboardUpdateResponse,
    validateDashboard,
    validateDashboardGetResponse,
    validateDashboardUpdateResponse
} from "../models/DashboardDTO";

export class DashboardAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getDashboards(): Promise<Response<DashboardGetResponse>> {
        return this.gateway.get("dashboard/", {
            validate: validateDashboardGetResponse
        });
    }

    async getDashboard(guid: string | null): Promise<Response<DashboardDTO>> {
        const requestData = qs.stringify({
            data: JSON.stringify({ guid })
        });
        return this.gateway.get(`dashboard/${guid}/`);
    }

    async createDashboard(
        data: DashboardUpdateRequest,
        options?: DashboardUpdateParams
    ): Promise<Response<DashboardUpdateResponse>> {
        const requestData = buildDashboardUpdateRequest(data, options);

        return this.gateway.post(`dashboard/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboardUpdateResponse
        });
    }

    async restoreDashboard(
        data: DashboardUpdateRequest,
        options?: DashboardUpdateParams
    ): Promise<Response<DashboardUpdateResponse>> {
        const requestData = buildDashboardUpdateRequest(data, options);

        return this.gateway.post(`dashboard/restore/${data.guid}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboardUpdateResponse
        });
    }

    async updateDashboard(
        data: DashboardUpdateRequest,
        options?: DashboardUpdateParams
    ): Promise<Response<DashboardUpdateResponse>> {
        const requestData = buildDashboardUpdateRequest(data, options);

        return this.gateway.put(`dashboard/${data.guid}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboardUpdateResponse
        });
    }

    async deleteDashboard(guid: string): Promise<Response<DashboardDTO>> {
        const requestData = qs.stringify({
            data: JSON.stringify({ guid })
        });

        return this.gateway.delete(`dashboard/${guid}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboard
        });
    }

    async deleteDashboardsInStack(stackID: number): Promise<void> {
        const response = await this.getDashboards();
        console.log(response.data.data);
        if (response.status === 200 && response.data && response.data.data) {
            for (const dash of response.data.data) {
                if (!dash.stack || dash.stack.id === stackID) {
                    await this.deleteDashboard(dash.guid);
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log((await this.getDashboards()).data.data);
        return;
    }
}

export const dashboardApi = new DashboardAPI();

function buildDashboardUpdateRequest(data: DashboardUpdateRequest, options?: DashboardUpdateParams): string {
    const request: any = {
        data: JSON.stringify([data])
    };

    if (options && !isNil(options.adminEnabled)) {
        request.adminEnabled = options.adminEnabled;
    }

    if (options && !isNil(options.isGroupDashboard)) {
        request.isGroupDashboard = options.isGroupDashboard;
    }

    if (options && !isNil(options.user_id)) {
        request.user_id = options.user_id;
    }

    return qs.stringify(request);
}

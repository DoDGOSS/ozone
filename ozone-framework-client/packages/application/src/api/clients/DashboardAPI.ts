import { isNil } from "lodash";

import { Gateway, getGateway, ListOf, Response } from "../interfaces";

import {
    DashboardDTO,
    DashboardUpdateRequest,
    validateDashboardDetailResponse,
    validateDashboardListResponse
} from "../models/DashboardDTO";

export class DashboardAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getDashboards(): Promise<Response<ListOf<DashboardDTO[]>>> {
        return this.gateway.get("dashboards/", {
            validate: validateDashboardListResponse
        });
    }

    async getDashboard(dashboardId: number): Promise<Response<DashboardDTO>> { // TODO: fix one of the callers that is still passing in the GUID
        return this.gateway.get(`dashboards/${dashboardId}/`);
    }

    async restoreDashboard(
        data: DashboardUpdateRequest,
    ): Promise<Response<DashboardDTO>> {
        return this.gateway.post(`dashboards/${data.id}/restore/`, null, { // TODO: verify guid works
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboardDetailResponse
        });
    }

    async updateDashboard(
        data: DashboardUpdateRequest,
    ): Promise<Response<DashboardDTO>> {
        return this.gateway.put(`dashboards/${data.id}/`, data, { // TODO: verify request data contains all properties needed for update.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateDashboardDetailResponse
        });
    }

    async deleteDashboard(data: DashboardDTO): Promise<Response<void>> {
        return this.gateway.delete(`dashboards/${data.id}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

}


export const dashboardApi = new DashboardAPI();

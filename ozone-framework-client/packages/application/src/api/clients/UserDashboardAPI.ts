import { Gateway, getGateway, Response } from "../interfaces";
import { UserDashboardsGetResponse, validateUserDashboardsGetResponse } from "../models/UserDashboardDTO";
import { DashboardDTO } from "../models/DashboardDTO";
import { DashboardLayout } from "../../models/Dashboard";
import { isNil, uuid } from "../../utility";
import { dashboardLayoutToDto } from "../../codecs/Dashboard.codec";

export class UserDashboardAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getOwnDashboards(): Promise<Response<UserDashboardsGetResponse>> {
        return this.gateway.get("me/dashboards-widgets/", {
            validate: validateUserDashboardsGetResponse
        });
    }

    async createDashboard(opts: DashboardCreateOpts): Promise<Response<DashboardDTO>> {
        // TODO: this should be refactored.
        const stack = {
            name: opts.name,
            id: opts.stackId
        };

        const dashboard = {
            name: opts.name,
            isdefault: !isNil(opts.isDefault) ? opts.isDefault : false,
            state: [],
            layoutConfig: dashboardLayoutToDto({
                backgroundWidgets: [],
                tree: opts.tree,
                panels: opts.panels || {}
            }),
            publishedToStore: false
        };

        const requestData = {
            description: opts.name,
            stack: stack,
            stack_id: opts.stackId,
            ...dashboard
        };

        return this.gateway.post("dashboards/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export interface DashboardCreateOpts extends DashboardLayout {
    name: string;
    isDefault?: boolean;
    stackId?: number;
    stackName?: string;
}

export const userDashboardApi = new UserDashboardAPI();

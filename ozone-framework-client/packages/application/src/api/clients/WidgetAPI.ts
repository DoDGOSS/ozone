import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import {
    GetWidgetGroupsResponse,
    validateWidgetDetailResponse,
    validateWidgetGroupsResponse,
    validateWidgetListResponse,
    WidgetCreateRequest,
    WidgetDTO,
    WidgetGetDescriptorResponse,
    WidgetUpdateRequest
} from "../models/WidgetDTO";
import { GetGroupWidgetsResponse, validateGroupWidgetsResponse } from "../models/GroupDTO";

export interface WidgetQueryCriteria {
    limit?: number;
    offset?: number;
    user_id?: number;
    group_id?: number;
}

export class WidgetAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgets(): Promise<Response<ListOf<WidgetDTO[]>>> {
        return this.gateway.get("admin/widgets/", {
            validate: validateWidgetListResponse
        });
    }

    async getWidgetById(id: string): Promise<Response<WidgetDTO>> {
        return this.gateway.get(`admin/widgets/${id}/`, {
            validate: validateWidgetDetailResponse
        });
    }

    async createWidget(data: WidgetCreateRequest): Promise<Response<WidgetDTO>> {
        return this.gateway.post("admin/widgets/", data, { // TODO: verify the data being sent is what the backend expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetDetailResponse
        });
    }

    async updateWidget(data: WidgetUpdateRequest): Promise<Response<WidgetDTO>> {
        return this.gateway.put(`admin/widgets/${data.id}/`, data, { // TODO: verify the data being sent is what the backend expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetDetailResponse
        });
    }

    async deleteWidget(id: string): Promise<Response<void>> {
        return this.gateway.delete(`admin/widgets/${id}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async getWidgetDescriptorJson(url: string): Promise<Response<WidgetGetDescriptorResponse>> {
        return this.gateway.get<WidgetGetDescriptorResponse>(url);
    }

    //TODO: verify this whole function works. Primarily the bulk add.
    async addWidgetUsers(widgetId: string, userIds: number | number[]): Promise<Response<ListOf<WidgetDTO[]>>> {
        let url = "admin/users-widgets/";
        let requestData: any = { widget_definition: widgetId };

        if (userIds instanceof Array) {
            requestData = { person_ids: userIds, ...requestData };
        } else {
            requestData = { person: userIds, ...requestData };
        }

        return this.gateway.post(url, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    //TODO: verify this whole function works. Primarily the bulk add.
    async addWidgetGroups(widgetId: string, groupIds: number | number[]): Promise<Response<GetWidgetGroupsResponse>> {
        let url = "admin/groups-widgets/";
        let requestData: any = { widget_id: widgetId };

        if (groupIds instanceof Array) {
            requestData = { group_ids: groupIds, ...requestData };
        } else {
            requestData = { group_id: groupIds, ...requestData };
        }

        return this.gateway.post(url, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetGroupsResponse
        });
    }

    //TODO: verify this whole function works.
    async removeWidgetUsers(widgetId: string, userId: number): Promise<Response<void>> {
        let requestData: any = { person_id: userId, widget_id: widgetId };

        return this.gateway.delete(`admin/users-widgets/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    //TODO: verify this whole function works. 
    async removeWidgetGroups(widgetId: string, groupId: number): Promise<Response<void>> {
        let requestData: any = { group_id: groupId, widget_id: widgetId };

        return this.gateway.delete("admin/groups-widgets/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    getWidgetsForGroup(groupId: string): Promise<Response<GetGroupWidgetsResponse>> {
        return this.gateway.get("admin/groups-widgets/", {
            params: {
                group_id: groupId
            },
            validate: validateGroupWidgetsResponse
        });
    }
}

export const widgetApi = new WidgetAPI();

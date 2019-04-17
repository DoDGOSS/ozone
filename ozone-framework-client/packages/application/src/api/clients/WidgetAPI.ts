import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

import { mapIds, mapUuids } from "../models/IdDTO";
import {
    validateWidgetCreateResponse,
    validateWidgetDeleteResponse,
    validateWidgetGetResponse,
    validateWidgetUpdateGroupsResponse,
    validateWidgetUpdateUsersResponse,
    WidgetCreateRequest,
    WidgetCreateResponse,
    WidgetDeleteResponse,
    WidgetGetDescriptorResponse,
    WidgetGetResponse,
    WidgetUpdateGroupsResponse,
    WidgetUpdateRequest,
    WidgetUpdateUsersResponse
} from "../models/WidgetDTO";

export interface WidgetQueryCriteria {
    limit?: number;
    offset?: number;
    user_id?: number;
}

export class WidgetAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgets(criteria?: WidgetQueryCriteria): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get("widget/", {
            params: getOptionParams(criteria),
            validate: validateWidgetGetResponse
        });
    }

    async getWidgetById(id: string): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get(`widget/${id}/`, {
            validate: validateWidgetGetResponse
        });
    }

    async getWidgetDescriptorJson(url: string): Promise<Response<WidgetGetDescriptorResponse>> {
        return this.gateway.get<WidgetGetDescriptorResponse>(url);
    }

    async createWidget(data: WidgetCreateRequest): Promise<Response<WidgetCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetCreateResponse
        });
    }

    async updateWidget(data: WidgetUpdateRequest): Promise<Response<WidgetCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.put(`widget/${data.id}`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetCreateResponse
        });
    }

    async addWidgetUsers(widgetId: string, userIds: number | number[]): Promise<Response<WidgetUpdateUsersResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(mapIds(userIds)),
            tab: "users",
            update_action: "add"
        });

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetUpdateUsersResponse
        });
    }

    async removeWidgetUsers(
        widgetId: string,
        userIds: number | number[]
    ): Promise<Response<WidgetUpdateUsersResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(mapIds(userIds)),
            tab: "users",
            update_action: "remove",
            _method: "PUT"
        });

        return this.gateway.put(`widget/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetUpdateUsersResponse
        });
    }

    async addWidgetGroups(
        widgetId: string,
        groupIds: number | number[]
    ): Promise<Response<WidgetUpdateGroupsResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(mapIds(groupIds)),
            tab: "groups",
            update_action: "add"
        });

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetUpdateGroupsResponse
        });
    }

    async removeWidgetGroups(
        widgetId: string,
        groupIds: number | number[]
    ): Promise<Response<WidgetUpdateGroupsResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(mapIds(groupIds)),
            tab: "groups",
            update_action: "remove"
        });

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetUpdateGroupsResponse
        });
    }

    async deleteWidget(id: string | string[]): Promise<Response<WidgetDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(mapUuids(id))
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetDeleteResponse
        });
    }
}

export const widgetApi = new WidgetAPI();

function getOptionParams(options?: WidgetQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.user_id) params.user_id = options.user_id;
    return params;
}

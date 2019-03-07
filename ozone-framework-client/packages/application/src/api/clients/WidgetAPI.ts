import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

import { IdDTO, UuidDTO } from "../models/IdDTO";
import {
    WidgetCreateRequest,
    WidgetCreateResponse,
    WidgetDeleteResponse,
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
            validate: WidgetGetResponse.validate
        });
    }

    async getWidgetById(id: string): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get(`widget/${id}/`, {
            validate: WidgetGetResponse.validate
        });
    }

    async createWidget(data: WidgetCreateRequest): Promise<Response<WidgetCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetCreateResponse.validate
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
            validate: WidgetCreateResponse.validate
        });
    }

    async addWidgetUsers(widgetId: string, userIds: number | number[]): Promise<Response<WidgetUpdateUsersResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(IdDTO.fromValues(userIds)),
            tab: "users",
            update_action: "add"
        });

        console.log(requestData);

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetUpdateUsersResponse.validate
        });
    }

    async removeWidgetUsers(
        widgetId: string,
        userIds: number | number[]
    ): Promise<Response<WidgetUpdateUsersResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(IdDTO.fromValues(userIds)),
            tab: "users",
            update_action: "remove"
        });

        console.log(requestData);

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetUpdateUsersResponse.validate
        });
    }

    async addWidgetGroups(
        widgetId: string,
        groupIds: number | number[]
    ): Promise<Response<WidgetUpdateGroupsResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(IdDTO.fromValues(groupIds)),
            tab: "groups",
            update_action: "add"
        });

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetUpdateGroupsResponse.validate
        });
    }

    async removeWidgetGroups(
        widgetId: string,
        groupIds: number | number[]
    ): Promise<Response<WidgetUpdateGroupsResponse>> {
        const requestData = qs.stringify({
            widget_id: widgetId,
            data: JSON.stringify(IdDTO.fromValues(groupIds)),
            tab: "groups",
            update_action: "remove"
        });

        return this.gateway.put(`widget/${widgetId}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetUpdateGroupsResponse.validate
        });
    }

    async deleteWidget(id: string | string[]): Promise<Response<WidgetDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(UuidDTO.fromValues(id))
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetDeleteResponse.validate
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

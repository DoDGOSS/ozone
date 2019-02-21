import * as qs from "qs";

import { inject, injectable, TYPES } from "../../inject";

import {
    Gateway,
    IdDto,
    Response,
    UuidDto,
    WidgetCreateRequest,
    WidgetCreateResponse,
    WidgetDeleteResponse,
    WidgetGetResponse,
    WidgetUpdateGroupsResponse,
    WidgetUpdateRequest,
    WidgetUpdateUsersResponse
} from "..";

@injectable()
export class WidgetAPI {
    private readonly gateway: Gateway;

    constructor(@inject(TYPES.Gateway) gateway: Gateway) {
        this.gateway = gateway;
    }

    async getWidgets(): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get("widget/", {
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
            data: JSON.stringify(IdDto.fromValues(userIds)),
            tab: "users",
            update_action: "add"
        });

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
            data: JSON.stringify(IdDto.fromValues(userIds)),
            tab: "users",
            update_action: "remove"
        });

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
            data: JSON.stringify(IdDto.fromValues(groupIds)),
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
            data: JSON.stringify(IdDto.fromValues(groupIds)),
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
            data: JSON.stringify(UuidDto.fromValues(id))
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetDeleteResponse.validate
        });
    }
}

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

    async getWidgetsAsUser(): Promise<Response<ListOf<WidgetDTO[]>>> {
        return this.gateway.get("widgets/", {
            validate: validateWidgetListResponse
        });
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
        return this.gateway.post("admin/widgets/", data, {
            // TODO: verify the data being sent is what the backend expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetDetailResponse
        });
    }

    async updateWidget(data: WidgetUpdateRequest): Promise<Response<WidgetDTO>> {
        return this.gateway.put(`admin/widgets/${data.id}/`, data, {
            // TODO: verify the data being sent is what the backend expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateWidgetDetailResponse
        });
    }

    async deleteWidget(id: number): Promise<Response<void>> {
        return this.gateway.delete(`admin/widgets/${id}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async getWidgetDescriptorJson(widget: WidgetDTO): Promise<Response<WidgetGetDescriptorResponse>> {
        const url = `widgets/${widget.value.widgetGuid}/export/`;
        return this.gateway.get<WidgetGetDescriptorResponse>(url);
    }

    async addWidgetUsers(widgetId: number, userIds: number | number[]): Promise<Response<ListOf<WidgetDTO[]>>> {
        const url = "admin/users-widgets/";
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

    async addWidgetGroups(widgetId: number, groupIds: number | number[]): Promise<Response<GetWidgetGroupsResponse>> {
        const url = "admin/groups-widgets/";
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

    async removeWidgetUsers(widgetId: number, userId: number): Promise<Response<void>> {
        const requestData: any = { person_id: userId, widget_id: widgetId };
        return this.gateway.delete(`admin/users-widgets/0/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async removeWidgetGroups(widgetId: number, groupId: number): Promise<Response<void>> {
        const requestData: any = { group_id: groupId, widget_id: widgetId };

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

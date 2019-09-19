import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

import {
    GroupCreateRequest,
    GroupCreateResponse,
    GroupDeleteResponse,
    GroupGetResponse,
    GroupUpdateRequest,
    GroupUpdateResponse,
    validateGroupCreateResponse,
    validateGroupDeleteResponse,
    validateGroupGetResponse,
    validateGroupUpdateResponse
} from "../models/GroupDTO";
import { mapIds } from "../models/IdDTO";

export interface GroupQueryCriteria {
    limit?: number;
    offset?: number;
    user_id?: number;
    widget_id?: number;
}

export class GroupAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    // TODO - Add admin groups people endpoint

    getGroups(criteria?: GroupQueryCriteria): Promise<Response<GroupGetResponse>> {
        return this.gateway.get("group/", {
            params: getOptionParams(criteria),
            validate: validateGroupGetResponse
        });
    }

    getGroupById(id: number): Promise<Response<GroupGetResponse>> {
        return this.gateway.get(`group/${id}/`, {
            validate: validateGroupGetResponse
        });
    }

    getGroupsForWidget(widgetId: string): Promise<Response<GroupGetResponse>> {
        const requestData = qs.stringify({
            _method: "GET",
            widget_id: widgetId
        });

        return this.gateway.post("group/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateGroupGetResponse
        });
    }

    createGroup(data: GroupCreateRequest): Promise<Response<GroupCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post("group/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateGroupCreateResponse
        });
    }

    updateGroup(data: GroupUpdateRequest): Promise<Response<GroupUpdateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.put(`group/${data.id}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateGroupUpdateResponse
        });
    }

    deleteGroup(id: number | number[]): Promise<Response<GroupDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(mapIds(id))
        });

        return this.gateway.post("group/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateGroupDeleteResponse
        });
    }
}

export const groupApi = new GroupAPI();

function getOptionParams(options?: GroupQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.user_id) params.user_id = options.user_id;
    if (options.widget_id) params.widget_id = options.widget_id;
    return params;
}

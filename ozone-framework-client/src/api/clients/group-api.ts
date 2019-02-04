import * as qs from "qs";

import { inject, injectable, TYPES } from "../../inject";

import {
    Gateway,
    GroupCreateRequest,
    GroupCreateResponse,
    GroupDeleteResponse,
    GroupGetResponse,
    GroupUpdateRequest,
    GroupUpdateResponse,
    IdDto,
    Response
} from "..";


export interface GroupQueryCriteria {
    limit?: number;
    offset?: number;
    user_id?: number;
}


@injectable()
export class GroupAPI {

    private readonly gateway: Gateway;

    constructor(@inject(TYPES.Gateway) gateway: Gateway) {
        this.gateway = gateway;
    }

    getGroups(criteria?: GroupQueryCriteria): Promise<Response<GroupGetResponse>> {
        return this.gateway.get("group/", {
            params: getOptionParams(criteria),
            validate: GroupGetResponse.validate
        });
    }

    getGroupById(id: number): Promise<Response<GroupGetResponse>> {
        return this.gateway.get(`group/${id}/`, {
            validate: GroupGetResponse.validate
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
            validate: GroupCreateResponse.validate
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
            validate: GroupUpdateResponse.validate
        });
    }

    deleteGroup(id: number | number[]): Promise<Response<GroupDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(IdDto.fromValues(id))
        });

        return this.gateway.post("group/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: GroupDeleteResponse.validate
        });
    }

}

function getOptionParams(options?: GroupQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.user_id) params.user_id = options.user_id;
    return params;
}


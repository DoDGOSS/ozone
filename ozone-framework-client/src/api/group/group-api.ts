import * as qs from "qs";

import { inject, injectable, TYPES } from "../../inject";
import { Gateway, Response } from "../interfaces";

import {
    GroupCreateRequest,
    GroupCreateResponse,
    GroupDeleteResponse,
    GroupGetResponse,
    GroupUpdateRequest,
    GroupUpdateResponse
} from "./group-dto";

import { toIdArray } from "../common";


@injectable()
export class GroupAPI {

    private readonly gateway: Gateway;

    constructor(@inject(TYPES.Gateway) gateway: Gateway) {
        this.gateway = gateway;
    }

    getGroups(): Promise<Response<GroupGetResponse>> {
        return this.gateway.get("group/", {
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

        return this.gateway.post(`group/${data.id}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: GroupUpdateResponse.validate
        });
    }

    deleteGroup(id: number | number[]): Promise<Response<GroupDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(toIdArray(id))
        });

        return this.gateway.post("group/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: GroupDeleteResponse.validate
        });
    }

}

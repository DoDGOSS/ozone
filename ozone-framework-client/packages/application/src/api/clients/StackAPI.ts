import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

import { mapIds } from "../models/IdDTO";
import {
    StackCreateRequest,
    StackCreateResponse,
    StackDeleteAdminResponse,
    StackDeleteUserResponse,
    StackGetResponse,
    StackUpdateRequest,
    StackUpdateResponse,
    validateStackCreateResponse,
    validateStackDeleteAdminResponse,
    validateStackDeleteUserResponse,
    validateStackGetResponse,
    validateStackUpdateResponse
} from "../models/StackDTO";

export interface StackQueryCriteria {
    limit?: number;
    offset?: number;
    userId?: number;
}

export class StackAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getStacks(criteria?: StackQueryCriteria): Promise<Response<StackGetResponse>> {
        return this.gateway.get("stack/", {
            params: getOptionParams(criteria),
            validate: validateStackGetResponse
        });
    }

    async getStackById(id: number): Promise<Response<StackGetResponse>> {
        return this.gateway.get(`stack/${id}/`, {
            validate: validateStackGetResponse
        });
    }

    async createStack(data: StackCreateRequest): Promise<Response<StackCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post(`stack/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackCreateResponse
        });
    }

    async updateStack(data: StackUpdateRequest): Promise<Response<StackUpdateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.put(`stack/${data.id}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackUpdateResponse
        });
    }

    deleteStackAsAdmin(id: number): Promise<Response<StackDeleteAdminResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            adminEnabled: true,
            data: JSON.stringify(mapIds(id))
        });

        return this.gateway.post("stack/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackDeleteAdminResponse
        });
    }

    deleteStackAsUser(id: number): Promise<Response<StackDeleteUserResponse>> {
        const requestData: any = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(mapIds(id))
        });

        return this.gateway.post("stack/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackDeleteUserResponse
        });
    }
}

function getOptionParams(options?: StackQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.userId) params.user_id = options.userId;
    return params;
}

import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

import { IdDTO } from "../models/IdDTO";
import {
    StackCreateRequest,
    StackDeleteResponse,
    StackGetResponse,
    StackUpdateParams,
    StackUpdateRequest,
    StackUpdateResponse
} from "../models/StackDTO";

import { isNil } from "lodash";

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
            validate: StackGetResponse.validate
        });
    }

    async getStackById(id: number): Promise<Response<StackGetResponse>> {
        return this.gateway.get(`stack/${id}/`, {
            validate: StackGetResponse.validate
        });
    }

    async createStack(data: StackCreateRequest): Promise<Response<StackUpdateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post(`stack/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: StackUpdateResponse.validate
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
            validate: StackUpdateResponse.validate
        });
    }

    deleteStack(id: number, options?: StackUpdateParams): Promise<Response<StackDeleteResponse>> {
        const requestData = buildStackDeleteRequest(id, options);

        return this.gateway.post("stack/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: StackDeleteResponse.validate
        });
    }
}

function buildStackDeleteRequest(id: number, options?: StackUpdateParams): string {
    const request: any = {
        data: JSON.stringify(IdDTO.fromValues(id)),
        _method: "DELETE"
    };

    if (options && !isNil(options.adminEnabled)) {
        request.adminEnabled = options.adminEnabled;
    }

    return qs.stringify(request);
}

function getOptionParams(options?: StackQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.userId) params.user_id = options.userId;
    return params;
}

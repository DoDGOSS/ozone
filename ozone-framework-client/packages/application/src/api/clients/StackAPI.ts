import * as qs from "qs";
import { isNil } from "lodash";

import { Gateway, getGateway, Response } from "../interfaces";

import { mapIds } from "../models/IdDTO";
import {
    StackCreateRequest,
    StackCreateResponse,
    StackDeleteResponse,
    StackGetResponse,
    StackUpdateParams,
    StackUpdateRequest,
    StackUpdateResponse,
    validateStackCreateResponse,
    validateStackDeleteResponse,
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
            // TODO: validate: StackGetResponse.validate
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

    deleteStack(id: number, options?: StackUpdateParams): Promise<Response<StackDeleteResponse>> {
        const requestData = buildStackDeleteRequest(id, options);

        return this.gateway.post("stack/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackDeleteResponse
        });
    }
}

function buildStackDeleteRequest(id: number, options?: StackUpdateParams): string {
    const request: any = {
        data: JSON.stringify(mapIds(id)),
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

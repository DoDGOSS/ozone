import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

import { mapIds } from "../models/IdDTO";
import {
    UserCreateRequest,
    UserCreateResponse,
    UserDeleteResponse,
    UserGetResponse,
    UserUpdateRequest,
    UserUpdateResponse,
    validateUserCreateResponse,
    validateUserDeleteResponse,
    validateUserGetResponse,
    validateUserUpdateResponse
} from "../models/UserDTO";

export interface UserQueryCriteria {
    _method?: string;
    limit?: number;
    offset?: number;
    group_id?: number;
    widget_id?: string;
}

export class UserAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    getUsers(criteria?: UserQueryCriteria): Promise<Response<UserGetResponse>> {
        return this.gateway.get("user/", {
            params: getOptionParams(criteria),
            validate: validateUserGetResponse
        });
    }

    getUsersForWidget(widgetId: string): Promise<Response<UserGetResponse>> {
        const requestData = qs.stringify({
            _method: "GET",
            widget_id: widgetId
        });

        return this.gateway.post("user/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserGetResponse
        });
    }

    getUserById(id: number): Promise<Response<UserGetResponse>> {
        return this.gateway.get(`user/${id}/`, {
            validate: validateUserGetResponse
        });
    }

    createUser(data: UserCreateRequest): Promise<Response<UserCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post("user/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserCreateResponse
        });
    }

    updateUser(data: UserUpdateRequest): Promise<Response<UserUpdateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post(`user/${data.id}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserUpdateResponse
        });
    }

    deleteUser(id: number | number[]): Promise<Response<UserDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(mapIds(id))
        });

        return this.gateway.post("user/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserDeleteResponse
        });
    }
}

export const userApi = new UserAPI();

function getOptionParams(options?: UserQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options._method) params._method = options._method;
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.group_id) params.group_id = options.group_id;
    if (options.widget_id) params.widget_id = options.widget_id;
    return params;
}

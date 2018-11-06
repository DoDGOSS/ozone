import * as qs from "qs";
import * as _ from "lodash";

import { Gateway, Response } from "../interfaces";
import { inject, injectable, TYPES } from "../../../inject";

import { UserGetResponse, validateUserResponse } from "./get";
import { UserCreateRequest, UserCreateResponse, validateCreateUserResponse } from "./create";
import { UserUpdateRequest, UserUpdateResponse, validateUserUpdateResponse } from "./update";
import { UserDeleteResponse, validateUserDeleteResponse } from "./delete";


export interface UserQueryCriteria {
    limit?: number;
    offset?: number;
}


@injectable()
export class UserAPI {

    private readonly gateway: Gateway;

    constructor(@inject(TYPES.Gateway) gateway: Gateway) {
        this.gateway = gateway;
    }

    getUsers(criteria?: UserQueryCriteria): Promise<Response<UserGetResponse>> {
        return this.gateway.get("user/", {
            params: getOptionParams(criteria),
            validate: validateUserResponse
        });
    }

    getUserById(id: number): Promise<Response<UserGetResponse>> {
        return this.gateway.get(`user/${id}/`, {
            validate: validateUserResponse
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
            validate: validateCreateUserResponse
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
            data: JSON.stringify(toIdArray(id))
        });

        return this.gateway.post("user/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserDeleteResponse
        });
    }

}

function getOptionParams(options?: UserQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    return params;
}

function toArray<T>(value: T | T[]): T[] {
    if (_.isUndefined(value)) return [];
    if (_.isArray(value)) return value;

    return [value];
}

function toIdArray(id: number | number[]): Array<{ id: number }> {
    return toArray(id).map((i) => ({ id: i }));
}

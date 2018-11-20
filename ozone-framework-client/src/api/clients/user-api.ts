import * as qs from "qs";

import { inject, injectable, TYPES } from "../../inject";

import {
    Gateway,
    IdDto,
    Response,
    UserCreateRequest,
    UserCreateResponse,
    UserDeleteResponse,
    UserGetResponse,
    UserUpdateRequest,
    UserUpdateResponse
} from "..";


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
            validate: UserGetResponse.validate
        });
    }

    getUserById(id: number): Promise<Response<UserGetResponse>> {
        return this.gateway.get(`user/${id}/`, {
            validate: UserGetResponse.validate
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
            validate: UserCreateResponse.validate
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
            validate: UserUpdateResponse.validate
        });
    }

    deleteUser(id: number | number[]): Promise<Response<UserDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(IdDto.fromValues(id))
        });

        return this.gateway.post("user/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: UserDeleteResponse.validate
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


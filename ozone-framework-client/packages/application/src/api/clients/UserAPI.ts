import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import {
    UserCreateRequest,
    UserDTO,
    UserUpdateRequest,
    validateUserDetailResponse,
    validateUserListResponse
} from "../models/UserDTO";
import { UserWidgetDTO, validateUserWidgetListResponse } from "../models/UserWidgetDTO";

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

    getUsers(): Promise<Response<ListOf<UserDTO[]>>> {
        return this.gateway.get("admin/users/", {
            validate: validateUserListResponse
        });
    }

    getUserById(id: number): Promise<Response<UserDTO>> {
        return this.gateway.get(`admin/users/${id}/`, {
            validate: validateUserDetailResponse
        });
    }

    createUser(data: UserCreateRequest): Promise<Response<UserDTO>> {
        return this.gateway.post("admin/users/", data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserDetailResponse
        });
    }

    updateUser(data: UserUpdateRequest): Promise<Response<UserDTO>> {
        return this.gateway.put(`admin/users/${data.id}/`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserDetailResponse
        });
    }

    deleteUser(id: number): Promise<Response<void>> {
        return this.gateway.delete(`admin/users/${id}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    getUsersForWidget(widgetId: number): Promise<Response<ListOf<UserWidgetDTO[]>>> {
        return this.gateway.get("admin/users-widgets/", {
            params: {
                widget_definition: widgetId
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateUserWidgetListResponse
        });
    }

    getUsersForGroup(groupId: number): Promise<Response<ListOf<any>>> {
        return this.gateway.get("admin/groups-people/", {
            params: {
                group: groupId
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const userApi = new UserAPI();

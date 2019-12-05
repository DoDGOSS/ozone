import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import {
    GroupCreateRequest,
    GroupDTO,
    GroupUpdateRequest,
    validateGroupDetailResponse,
    validateGroupListResponse
} from "../models/GroupDTO";
import { GetWidgetGroupsResponse, validateWidgetGroupsResponse } from "../models/WidgetDTO";
import { UserDTO } from "../models/UserDTO";

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

    getGroups(): Promise<Response<ListOf<GroupDTO[]>>> {
        return this.gateway.get("admin/groups/", {
            validate: validateGroupListResponse
        });
    }

    getGroupById(id: number): Promise<Response<GroupDTO>> {
        return this.gateway.get(`admin/groups/${id}/`, {
            validate: validateGroupDetailResponse
        });
    }

    getGroupsForWidget(widgetId: number): Promise<Response<GetWidgetGroupsResponse>> {
        return this.gateway.get("admin/groups-widgets/", {
            params: {
                widget_id: widgetId
            },
            validate: validateWidgetGroupsResponse
        });
    }

    getGroupsForUser(userId: number): Promise<Response<any>> {
        return this.gateway.get("admin/groups-people/", {
            params: {
                person: userId
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    getGroupsForStack(stackId: number): Promise<Response<any>> {
        return this.gateway.get("admin/stacks-groups/", {
            params: {
                stack: stackId
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    createGroup(data: GroupCreateRequest): Promise<Response<GroupDTO>> {
        return this.gateway.post("admin/groups/", data, {
            // TODO: verify the data being sent up is everything the api expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateGroupDetailResponse
        });
    }

    updateGroup(data: GroupUpdateRequest | GroupUpdateRequest): Promise<Response<GroupDTO>> {
        return this.gateway.put(`admin/groups/${data.id}/`, data, {
            // TODO: verify the data being sent up is everything the api expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateGroupDetailResponse
        });
    }

    deleteGroup(id: number): Promise<Response<void>> {
        const url = `admin/groups/${id}/`;

        return this.gateway.delete(url, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async addUsersToGroup(group: GroupDTO, users: UserDTO[]): Promise<any> {
        const url = "admin/groups-people/";

        const responses: any = [];
        for (const user of users) {
            const requestData: any = {
                group: group.id,
                person: (user as any).id
            };

            const response = await this.gateway.post(url, requestData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            responses.push(response);
        }
        return responses[0];
    }

    async removeUsersFromGroup(group: GroupDTO, users: UserDTO[]): Promise<any> {
        // here /0/ is a dummy detail view so delete in backend can take place
        // otherwise backend doesnt offer DELETE method a list.
        const url = "admin/groups-people/0/"; // TODO: verify this works
        const requestData: any = {
            group_id: group.id,
            person_ids: users.map((user: UserDTO) => user.id)
        };

        return this.gateway.delete(url, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const groupApi = new GroupAPI();

import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import { GroupDTO } from "../models/GroupDTO";
import { UserDTO } from "../models/UserDTO";

import { dashboardApi } from "./DashboardAPI";
import {
    StackCreateRequest,
    StackDTO,
    StackGroupResponse,
    StackUpdateRequest,
    StackUserResponse,
    validateStackDetailResponse,
    validateStackGroupResponse,
    validateStackListResponse,
    validateStackUserResponse
} from "../models/StackDTO";
import { groupApi } from "./GroupAPI";

export interface StackQueryCriteria {
    limit?: number;
    offset?: number;
    userId?: number;
    groupId?: number;
}

// TODO: need to create a new functions to hit the admin url and replace in all admin widgets.
export class StackAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getStacks(): Promise<Response<ListOf<StackDTO[]>>> {
        return this.gateway.get("stacks/", { // TODO: from todo above class definition
            validate: validateStackListResponse
        });
    }

    async getStackById(id: number): Promise<Response<StackDTO>> {
        return this.gateway.get(`stacks/${id}/`, {  // TODO: from todo above class definition
            validate: validateStackDetailResponse
        });
    }

    async createStack(data: StackCreateRequest): Promise<Response<StackDTO>> {
        return this.gateway.post(`stacks/`, data, { // TODO: verify request data is what api expects
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackDetailResponse
        });
    }

    async updateStack(data: StackUpdateRequest): Promise<Response<StackDTO>> {
        return this.gateway.put(`stacks/${data.id}/`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validateStackDetailResponse
        });
    }

    async restoreStack(stackId: number): Promise<Response<StackDTO>> {
        return this.gateway.post(`stacks/${stackId}/restore/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async shareStack(stackId: number): Promise<Response<void>> {
        return this.gateway.post(`stacks/${stackId}/share/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async assignStackToMe(stackId: number): Promise<Response<void>> {
        return this.gateway.patch(`admin/stacks/${stackId}/assign_to_me/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async getStacksAsAdmin(): Promise<Response<ListOf<StackDTO[]>>> {
        return this.gateway.get("admin/stacks/", {
            validate: validateStackListResponse
        });
    }

    async deleteStackAsAdmin(stackId: number): Promise<Response<void>> {
        return this.gateway.delete(`admin/stacks/${stackId}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async deleteStackAsUser(stackId: number): Promise<Response<void>> {
        return this.gateway.delete(`stacks/${stackId}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async addStackGroups(id: any, groups: GroupDTO[]): Promise<Response<StackGroupResponse>> {
        const url = "admin/stacks-groups/";
        let responses: any = [];
        for (const group of groups) { // TODO: enhancement by creating an endpoint for bulk add.
            const requestData = {
                stack: id,
                group: (group as any).id
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

    async removeStackGroups(stackId: any, groups: GroupDTO[]): Promise<Response<void>> {
        const requestData = {
            stack_id: stackId,
            group_ids: groups.map((group: any) => group.id)
        };

        // here /0/ is a dummy detail view so delete in backend can take place
        // otherwise backend doesnt offer DELETE method a list.
        const url = "admin/stacks-groups/0/";

        return this.gateway.delete(url, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    async addStackUsers(stack: StackDTO, users: UserDTO[]): Promise<Response<any>> {
        const group: any = { id: 
            (typeof stack.defaultGroup === "number") ? stack.defaultGroup: stack.defaultGroup.id 
        };
        return groupApi.addUsersToGroup(group, users);
    }

    async removeStackUsers(stack: StackDTO, users: UserDTO[]): Promise<Response<void>> {
        const group: any = { id: 
            (typeof stack.defaultGroup === "number") ? stack.defaultGroup: stack.defaultGroup.id 
        };
        return groupApi.removeUsersFromGroup(group, users);
    }

    async getStacksForUser(userId: number): Promise<Response<StackUserResponse>> {
        return this.gateway.get("admin/users-stacks/", {
            params: { person: userId },
            validate: validateStackUserResponse
        });
    }

    async getStacksForGroup(groupId: number): Promise<Response<any>> {
        return this.gateway.get("admin/stacks-groups/", {
            params: { group: groupId },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const stackApi = new StackAPI();

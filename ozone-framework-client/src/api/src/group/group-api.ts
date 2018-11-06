import { Gateway, Response } from "../interfaces";
import { GroupGetResponse, validateGroupResponse } from "./get";


export class GroupAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getGroups(): Promise<Response<GroupGetResponse>> {
        return this.gateway.get("group/", {
            validate: validateGroupResponse
        });
    }

    async getGroupById(id: number): Promise<Response<GroupGetResponse>> {
        return this.gateway.get(`group/${id}/`, {
            validate: validateGroupResponse
        });
    }

}

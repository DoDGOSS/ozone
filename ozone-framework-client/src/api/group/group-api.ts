import { Gateway, Response } from "../interfaces";

import { validateGroupGetResponse } from "./group.schema";
import { GroupGetResponse } from "./group.dto";


export class GroupAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getGroups(): Promise<Response<GroupGetResponse>> {
        return this.gateway.get("group/", {
            validate: validateGroupGetResponse
        });
    }

    async getGroupById(id: number): Promise<Response<GroupGetResponse>> {
        return this.gateway.get(`group/${id}/`, {
            validate: validateGroupGetResponse
        });
    }

}

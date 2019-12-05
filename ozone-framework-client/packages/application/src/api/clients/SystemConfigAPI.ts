import { Gateway, getGateway, ListOf, Response } from "../interfaces";

import {
    ConfigDTO,
    ConfigUpdateRequest,
    validateConfigDetailResponse,
    validateConfigListResponse
} from "../models/ConfigDTO";

export class SystemConfigAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getConfigs(): Promise<Response<ListOf<ConfigDTO[]>>> {
        return this.gateway.get("application-configuration/", {
            validate: validateConfigListResponse
        });
    }

    async updateConfigById(id: number, value: string): Promise<Response<ConfigDTO>> {
        const requestData: ConfigUpdateRequest = { id, value };
        return this.gateway.patch(`admin/application-configuration/${id}/`, requestData, {
            // TODO: verify that the data being sent up is what the backend expects.
            validate: validateConfigDetailResponse
        });
    }
}

export const systemConfigApi = new SystemConfigAPI();

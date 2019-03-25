import { Gateway, getGateway, Response } from "../interfaces";

import { ConfigDTO, ConfigUpdateRequest, validateConfig, validateConfigList } from "../models/ConfigDTO";

export class SystemConfigAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getConfigs(): Promise<Response<ConfigDTO[]>> {
        return this.gateway.get("applicationConfiguration/configs/", {
            validate: validateConfigList
        });
    }

    async updateConfig(data: ConfigUpdateRequest): Promise<Response<ConfigDTO>> {
        return this.gateway.put(`applicationConfiguration/configs/${data.id}/`, data, {
            validate: validateConfig
        });
    }
}

export const systemConfigApi = new SystemConfigAPI();

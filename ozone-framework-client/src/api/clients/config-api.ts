import { ConfigDTO, ConfigUpdateRequest, Gateway, Response } from "..";


export class ConfigAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getConfigs(): Promise<Response<ConfigDTO[]>> {
        return this.gateway.get("applicationConfiguration/configs/", {
            validate: ConfigDTO.validateList
        });
    }

    async updateConfig(data: ConfigUpdateRequest): Promise<Response<ConfigDTO>> {
        return this.gateway.put(`applicationConfiguration/configs/${data.id}/`, data, {
            validate: ConfigDTO.validate
        });
    }

}

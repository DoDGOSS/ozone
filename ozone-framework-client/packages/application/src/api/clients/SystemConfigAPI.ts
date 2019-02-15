import { ConfigDTO, ConfigUpdateRequest, Gateway, Response } from "..";

import { OzoneGateway } from "../../services";

import { lazy } from "../../utility";


export class SystemConfigAPI {

    static readonly instance = lazy(() => new SystemConfigAPI());

    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || OzoneGateway.instance();
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


import { Gateway, getGateway, Response } from "../interfaces";
import { HelpGetResponse, validateHelpGetResponse } from "../models/HelpDTO";

export class HelpAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    getHelpFiles(): Promise<Response<HelpGetResponse>> {
        return this.gateway.get("help/", {
            validate: validateHelpGetResponse
        });
    }
}

export const helpApi = new HelpAPI();

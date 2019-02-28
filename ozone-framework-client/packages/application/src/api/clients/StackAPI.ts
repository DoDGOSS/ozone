import { Gateway, getGateway, Response } from "../interfaces";

export class StackAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getStacks(): Promise<Response<any>> {
        return this.gateway.get("stack/");
    }

    async getStackById(id: number): Promise<Response<any>> {
        return this.gateway.get(`stack/${id}/`);
    }
}

export const stackApi = new StackAPI();

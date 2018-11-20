import { Gateway, Response } from "..";


export class StackAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getStacks(): Promise<Response<any>> {
        return this.gateway.get("stack/");
    }

    async getStackById(id: number): Promise<Response<any>> {
        return this.gateway.get(`stack/${id}/`);
    }

}

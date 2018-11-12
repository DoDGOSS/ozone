import { Gateway, Response } from "../interfaces";


export class WidgetAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getWidgets(): Promise<Response<any>> {
        return this.gateway.get("widget/");
    }

    async getWidgetById(id: string): Promise<Response<any>> {
        return this.gateway.get(`widget/${id}/`);
    }

}

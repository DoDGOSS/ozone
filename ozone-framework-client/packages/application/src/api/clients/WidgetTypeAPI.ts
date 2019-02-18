import { Gateway, getGateway, Response } from "../interfaces";

export class WidgetTypeAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetTypes(): Promise<Response<any>> {
        return this.gateway.get("/widgettype/list/");
    }
}

export const widgetTypeApi = new WidgetTypeAPI();

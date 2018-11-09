import { Gateway, Response } from "../interfaces";


export class WidgetTypeAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getWidgetTypes(): Promise<Response<any>> {
        return this.gateway.get("/widgettype/list/");
    }

}

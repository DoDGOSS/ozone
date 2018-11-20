import { Gateway, Response, WidgetGetResponse } from "..";


export class WidgetAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getWidgets(): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get("widget/", {
            validate: WidgetGetResponse.validate
        });
    }

    async getWidgetById(id: string): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get(`widget/${id}/`, {
            validate: WidgetGetResponse.validate
        });
    }

}

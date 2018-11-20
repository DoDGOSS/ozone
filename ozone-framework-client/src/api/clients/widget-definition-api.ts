import { Gateway, Response } from "..";


export class WidgetDefinitionAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getWidgetDefinitionById(id: string): Promise<Response<any>> {
        return this.gateway.get(`/prefs/widgetDefinition/${id}/`);
    }

}

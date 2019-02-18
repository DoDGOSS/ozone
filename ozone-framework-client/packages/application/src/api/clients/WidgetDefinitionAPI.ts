import { Gateway, getGateway, Response } from "../interfaces";

export class WidgetDefinitionAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetDefinitionById(id: string): Promise<Response<any>> {
        return this.gateway.get(`/prefs/widgetDefinition/${id}/`);
    }
}

export const widgetDefinitionApi = new WidgetDefinitionAPI();

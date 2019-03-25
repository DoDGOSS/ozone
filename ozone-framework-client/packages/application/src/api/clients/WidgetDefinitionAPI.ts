import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

export class WidgetDefinitionAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetDefinitions(): Promise<Response<any>> {
        return this.gateway.get(`/prefs/widgetDefinition/`);
    }

    async getWidgetDefinitionById(id: string): Promise<Response<any>> {
        return this.gateway.get(`/prefs/widgetDefinition/${id}/`);
    }

    async groupOwnsWidget(data: any): Promise<Response<any>> {
        const requestData = qs.stringify(data);
        return this.gateway.post(`/widgetDefinition/groupOwnedWidget`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const widgetDefinitionApi = new WidgetDefinitionAPI();

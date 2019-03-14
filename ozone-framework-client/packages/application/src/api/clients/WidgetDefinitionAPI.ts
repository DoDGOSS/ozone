import { Gateway, getGateway, Response } from "../interfaces";

export class WidgetDefinitionAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetDefinitionById(id: string): Promise<Response<any>> {
        return this.gateway.get(`/prefs/widgetDefinition/${id}/`);
    }

    async groupOwnsWidget(payload: any): Promise<Response<any>> {
        return this.gateway.post(
			`/widgetDefinition/groupOwnedWidget`,
			JSON.stringify(payload), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
            // validate: ??.validate
        });
    }
}

export const widgetDefinitionApi = new WidgetDefinitionAPI();

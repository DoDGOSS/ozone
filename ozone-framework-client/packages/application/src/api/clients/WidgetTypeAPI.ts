import { Gateway, getGateway, Response } from "../interfaces";

import { WidgetTypeDTO } from "../models/WidgetTypeDTO";

export class WidgetTypeAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetTypes(): Promise<Response<Response<WidgetTypeDTO[]>>> {
        return this.gateway.get("/widgettype/list/");
    }

    async widgetTypesAsList(typesList: string[]) {
        return await Promise.all(typesList.map((type: string) => this.getWidgetType(type)));
    }

    async getWidgetType(name: string): Promise<WidgetTypeDTO> {
        const response = await this.getWidgetTypes();
        if (response.status !== 200 || !response.data.data || !response.data.data.length) {
            return {
                id: 1,
                name: "Standard",
                displayName: "standard"
            };
        }
        const allWidgetTypes = response.data.data;
        let type: WidgetTypeDTO | undefined = allWidgetTypes.find(
            (widgetType: WidgetTypeDTO) => widgetType.name === name
        );

        if (!type) {
            type = allWidgetTypes.find((widgetType: WidgetTypeDTO) => widgetType.name === "standard");
            if (!type) {
                return allWidgetTypes[0];
            }
        }
        return type;
    }
}

export const widgetTypeApi = new WidgetTypeAPI();

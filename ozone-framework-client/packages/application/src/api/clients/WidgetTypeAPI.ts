import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import { validateWidgetTypeListResponse, WidgetTypeDTO } from "../models/WidgetTypeDTO";

export class WidgetTypeAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetTypes(): Promise<Response<ListOf<WidgetTypeDTO[]>>> {
        return this.gateway.get("admin/widgets-types/", {
            validate: validateWidgetTypeListResponse
        });
    }

    async getWidgetType(name: string): Promise<WidgetTypeDTO> {
        const response: Response<ListOf<WidgetTypeDTO[]>> = await this.getWidgetTypes();
        if (!(response.status >= 200 && response.status < 400)) {
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

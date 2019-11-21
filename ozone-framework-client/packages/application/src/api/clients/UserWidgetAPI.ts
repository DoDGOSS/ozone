import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import { UserWidgetDTO, validateUserWidgetListResponse } from "../models/UserWidgetDTO";
import { Widget } from "../../models/Widget";

export interface UserWidgetQueryCriteria {
    limit?: number;
    offset?: number;
    user_id?: number;
}

export class UserWidgetAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getUserWidgets(userId: number): Promise<Response<ListOf<UserWidgetDTO[]>>> {
        return this.gateway.get("admin/users-widgets/", {
            params: { person: userId },
            validate: validateUserWidgetListResponse
        });
    }

    async deleteUserWidget(personWidgetId: number): Promise<Response<void>> {
        return this.gateway.delete(`admin/users-widgets/${personWidgetId}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const userWidgetApi = new UserWidgetAPI();

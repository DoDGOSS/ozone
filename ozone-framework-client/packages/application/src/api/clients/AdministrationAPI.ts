import { Gateway, getGateway, Response } from "../interfaces";

export class AdministrationAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getWidgetDefinitions(): Promise<Response<any>> {
        return this.gateway.get("administration/listWidgetDefinitions/");
    }

    async getPreferences(): Promise<Response<any>> {
        return this.gateway.get("administration/listPreferences/");
    }

    async getDashboards(): Promise<Response<any>> {
        return this.gateway.get("administration/listDashboards/");
    }

    async getRoles(): Promise<Response<any>> {
        return this.gateway.get("administration/listPersonRoles/");
    }
}

export const administrationApi = new AdministrationAPI();

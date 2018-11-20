import { Gateway, Response } from "..";


export class DashboardAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getDashboards(): Promise<Response<any>> {
        return this.gateway.get("dashboard/");
    }

}

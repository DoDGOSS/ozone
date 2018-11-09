import { DashboardAPI } from "../../";

import { NodeGateway } from "./node-gateway";


describe("Dashboard API", () => {

    let gateway: NodeGateway;
    let dashboardApi: DashboardAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        dashboardApi = new DashboardAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getDashboards - GET /dashboard/", async () => {
        const response = await dashboardApi.getDashboards();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "success": true,
            "results": 0,
            "data": []
        });
    });

});

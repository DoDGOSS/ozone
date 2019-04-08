import { UserWidgetAPI } from "../../src/api/clients/UserWidgetAPI";

import { NodeGateway } from "./node-gateway";

import { logResponse } from "./assertions";

describe("Widget API", () => {
    let gateway: NodeGateway;
    let userWidgetApi: UserWidgetAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        userWidgetApi = new UserWidgetAPI(gateway);

        await gateway.login("testUser1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test(`${UserWidgetAPI.prototype.getUserWidgets.name}`, async () => {
        const response = await userWidgetApi.getUserWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toHaveLength(11);
    });

});

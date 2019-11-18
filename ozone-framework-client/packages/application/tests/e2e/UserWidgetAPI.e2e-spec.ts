import { UserWidgetAPI } from "../../src/api/clients/UserWidgetAPI";

import { NodeGateway } from "./NodeGateway";

import { logResponse } from "./assertions";

describe("User Widget API", () => {
    let gateway: NodeGateway;
    let userWidgetApi: UserWidgetAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        userWidgetApi = new UserWidgetAPI(gateway);

        await gateway.login("user", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test(`${UserWidgetAPI.prototype.getUserWidgets.name}`, async () => {
        const response = await userWidgetApi.getUserWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toHaveLength(6);
    });
});

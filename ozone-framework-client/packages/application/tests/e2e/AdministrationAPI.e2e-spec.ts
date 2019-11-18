import { AdministrationAPI } from "../../src/api/clients/AdministrationAPI";

import { NodeGateway } from "./NodeGateway";
import { checkForDefaultPrefs } from "./assertions";

describe("Administration API", () => {
    let gateway: NodeGateway;
    let adminApi: AdministrationAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        adminApi = new AdministrationAPI(gateway);

        await gateway.login("admin", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getWidgetDefinitions - GET /administration/listWidgetDefinitions/", async () => {
        const response = await adminApi.getWidgetDefinitions();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]);
    });

    test("getPreferences - GET /administration/listPreferences/", async () => {
        const response = await adminApi.getPreferences();

        expect(response.status).toEqual(200);
        checkForDefaultPrefs(response.data);
    });

    test("getDashboards - GET /administration/listDashboards/", async () => {
        const response = await adminApi.getDashboards();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 0,
            rows: []
        });
    });

    test("getRoles - GET /administration/listPersonRoles/", async () => {
        const response = await adminApi.getRoles();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 2,
            rows: ["ROLE_ADMIN", "ROLE_USER"]
        });
    });
});

import "reflect-metadata";

import { PreferenceAPI } from "./preference-api";

import { NodeGateway } from "../__test__/node-gateway";
import { PREFERENCES } from "../__test__/data";


describe("Preference API", () => {

    let gateway: NodeGateway;
    let preferenceApi: PreferenceAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        preferenceApi = new PreferenceAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getPreferences - GET /prefs/preference/", async () => {
        const response = await preferenceApi.getPreferences();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 5,
            rows: PREFERENCES
        });
    });

    test("getPreferences by namespace - GET /prefs/preference/:namespace/", async () => {
        const response = await preferenceApi.getPreferences("owf.admin.WidgetEditCopy");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 1,
            rows: [PREFERENCES[1]]
        });
    });

    test("getPreference - GET /prefs/preference/:namespace/:path/", async () => {
        const response = await preferenceApi.getPreference("owf.admin.WidgetEditCopy", "guid_to_launch");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(PREFERENCES[1]);
    });

    test("getServerResources - GET /prefs/server/resources/", async () => {
        const response = await preferenceApi.getServerResources();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            serverVersion: "7.17.2-0"
        });
    });

});

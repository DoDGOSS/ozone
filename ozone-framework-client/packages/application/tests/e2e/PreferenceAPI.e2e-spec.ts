import { PreferenceAPI } from "../../src/api/clients/PreferenceAPI";

import {
    PreferenceCreateRequest,
    PreferenceDeleteRequest,
    PreferenceDTO,
    PreferenceUpdateRequest
} from "../../src/api/models/PreferenceDTO";
import { NodeGateway } from "./NodeGateway";
import { PREFERENCES } from "../unit/data";
import { checkForDefaultPrefs, logResponse } from "./assertions";
import { AuthUserDTO } from "../../src/api/models/AuthUserDTO";

describe("Preference API", () => {
    let gateway: NodeGateway;
    let preferenceApi: PreferenceAPI;

    let user: AuthUserDTO;

    beforeAll(async () => {
        gateway = new NodeGateway();
        preferenceApi = new PreferenceAPI(gateway);

        const response = await gateway.login("admin", "password");
        user = response.data;
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getPreferences - GET /prefs/preference/", async () => {
        let response;

        try {
            response = await preferenceApi.getPreferences();
        } catch (ex) {
            console.dir(ex.errors);
            return fail();
        }

        expect(response.status).toEqual(200);
        checkForDefaultPrefs(response.data);
    });

    test("getPreferences by namespace - GET /prefs/preference/:namespace/", async () => {
        let response;
        try {
            response = await preferenceApi.getPreferences("owf.admin.WidgetEditCopy");
        } catch (ex) {
            console.dir(ex.errors);
            return fail();
        }

        expect(response.status).toEqual(200);

        expect(response.data).toEqual({
            success: true,
            results: 1,
            rows: [PREFERENCES[1]]
        });
    });

    test("getPreference - GET /prefs/preference/:namespace/:path/", async () => {
        const response = await preferenceApi.getPreference("owf.admin.WidgetEditCopy", "guid_to_launch");
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            preference: PREFERENCES[1]
        });
    });

    test("getPreference failure - GET /prefs/preference/:namespace/:path/", async () => {
        const response = await preferenceApi.getPreference("nonexistant", "setting");
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            preference: null
        });
    });

    test("getServerResources - GET /prefs/server/resources/", async () => {
        const response = await preferenceApi.getServerResources();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            serverVersion: "8.0.0-0"
        });
    });

    describe("create, update, and delete", () => {
        let preference: PreferenceDTO;

        test("createPreference - POST /prefs/preference/:namespace/:path/", async () => {
            const request: PreferenceCreateRequest = {
                namespace: "owf.test.TestWidget",
                path: "path",
                value: "value"
            };

            const response = await preferenceApi.createPreference(request);
            logResponse(response);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                id: expect.any(Number),
                namespace: request.namespace,
                path: request.path,
                value: request.value,
                user: {
                    userId: user.username
                }
            });

            preference = response.data;
        });

        test("updatePreference - POST /prefs/preference/:namespace/:path/", async () => {
            const request: PreferenceUpdateRequest = {
                id: preference.id,
                namespace: preference.namespace,
                path: preference.path,
                value: "new value"
            };

            const response = await preferenceApi.updatePreference(request);
            logResponse(response);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                id: preference.id,
                namespace: preference.namespace,
                path: preference.path,
                value: request.value,
                user: {
                    userId: preference.user.userId
                }
            });

            preference = response.data;
        });

        test("deletePreference - DELETE /prefs/preference/:namespace/:path/", async () => {
            const request: PreferenceDeleteRequest = {
                id: preference.id,
                namespace: preference.namespace,
                path: preference.path
            };

            const response = await preferenceApi.deletePreference(request);
            logResponse(response);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                id: preference.id,
                namespace: preference.namespace,
                path: preference.path,
                value: preference.value,
                user: {
                    userId: preference.user.userId
                }
            });
        });
    });
});

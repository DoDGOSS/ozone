import "reflect-metadata";

import { PreferenceAPI, PreferenceCreateRequest, PreferenceUpdateRequest } from "../../src/api/clients/PreferenceAPI";

import { NodeGateway } from "./node-gateway";
import { PREFERENCES } from "../unit/data";

describe("Preference API", () => {
    let gateway: NodeGateway;
    let preferenceApi: PreferenceAPI;
    let newSetting: PreferenceCreateRequest;
    let newPreference: PreferenceCreateRequest;

    beforeAll(async () => {
        gateway = new NodeGateway();
        preferenceApi = new PreferenceAPI(gateway);

        newSetting = {
          namespace: "owf.admin.WidgetEditCopy",
          path: "newSetting2",
          value: "someValue2"
        }

        newPreference = {
          namespace: "newField",
          path: "newSetting3",
          value: "someOtherValue"
        }

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getPreferences - GET /prefs/preference/", async () => {
        const response = await preferenceApi.getPreferences();

        expect(response.status).toEqual(200);
        // expect(response.data).toEqual({
        //     success: true,
        //     results: 5,
        //     rows: PREFERENCES
        // });
    });

    test("getPreferences by namespace - GET /prefs/preference/:namespace/", async () => {
        const response = await preferenceApi.getPreferences("owf.admin.WidgetEditCopy");

        expect(response.status).toEqual(200);
        // expect(response.data).toEqual({
        //     success: true,
        //     results: 1,
        //     rows: [PREFERENCES[1]]
        // });
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

    test("createPreference - POST /prefs/preference/:namespace/:path/", async () => {
        try {
          const settingResponse = await preferenceApi.createPreference(newSetting);
          expect(settingResponse.status).toEqual(200);
          expect(settingResponse.data).toEqual({
            success: true,
            preference: [newSetting]
          });
        }
        catch(e) {
          console.dir(e.errors);
        }

        try {
          // const getNewSettingResponse = await preferenceApi.getPreference(newSetting.namespace, newSetting.path);
          // expect(getNewSettingResponse.status).toEqual(200);
          // expect(getNewSettingResponse.data).toEqual(newSetting);
        }
        catch(e) {
          console.dir(e.errors);
        }

        try {
          let deleteSettingResponse = await preferenceApi.deletePreference(newSetting);
          expect(deleteSettingResponse.status).toEqual(200);
          expect(deleteSettingResponse.data).toEqual({
              success: true,
              data: null
          });
        }
        catch(e) {
          console.dir(e.errors);
        }

        // const getBaseResponse = await preferenceApi.getPreferences();
        // expect(getBaseResponse.status).toEqual(200);
        // expect(getBaseResponse.data).toEqual({
        //   success: true,
        //   results: 5,
        //   rows: PREFERENCES
        // });


        // const prefResponse = await preferenceApi.createPreference(newPreference);
        // expect(prefResponse.data).toEqual(newPreference);
        //
        // const getNewPreferenceResponse = await preferenceApi.getPreference(newPreference.namespace, newPreference.path);
        // expect(getNewPreferenceResponse.status).toEqual(200);
        // expect(getNewPreferenceResponse.data).toEqual(newPreference);
        //
        // let deletePrefResponse = await preferenceApi.deletePreference(newPreference);
        // expect(deletePrefResponse.status).toEqual(200);
        // expect(deletePrefResponse.data).toEqual(newPreference);
        //
        // const getBaseResponse2 = await preferenceApi.getPreferences();
        // expect(getBaseResponse2.status).toEqual(200);
        // expect(getBaseResponse2.data).toEqual({
        //   success: true,
        //   results: 5,
        //   rows: PREFERENCES
        // });

    });
});

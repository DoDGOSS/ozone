import "reflect-metadata";

import { PreferenceAPI } from "../../src/api/clients/PreferenceAPI";
import { PreferenceDTO } from "../../src/api/models/PreferenceDTO";

import { NodeGateway } from "./node-gateway";
import { PREFERENCES } from "../unit/data";


export let checkForDefaultPrefs = (data: any) => {
    data.results = 5
    expect(data).toEqual({
        success: true,
        results: expect.anything(),
        rows: expect.arrayContaining(PREFERENCES)
    });
    expect(data.results === 5 || data.results === 6).toBeTruthy();
}


describe("Preference API", () => {
    let gateway: NodeGateway;
    let preferenceApi: PreferenceAPI;
    let newSetting: PreferenceDTO  = {
        id: 6,
        namespace: "owf.admin.WidgetEditCopy",
        path: "newSetting",
        value: "someValue2",
        user: {userId: "testAdmin1"}
    };
    let newPreference: PreferenceDTO = {
        id: 7,
        namespace: "newField",
        path: "newSetting3",
        value: "someOtherValue",
        user: {userId: "testAdmin1"}
    };

    beforeAll(async () => {
        gateway = new NodeGateway();
        preferenceApi = new PreferenceAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });


    test("getPreferences - GET /prefs/preference/", async () => {
        let response;

        try {
            response = await preferenceApi.getPreferences();
        }
        catch (ex) {
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
        }
        catch (ex) {
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
        let response;
        try {
            response = await preferenceApi.getPreference("owf.admin.WidgetEditCopy", "guid_to_launch");
        }
        catch (ex) {
            console.dir(ex.errors);
            return fail();
        }

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
			success: true,
			data: PREFERENCES[1]
		});
    });

    test("getPreference failure - GET /prefs/preference/:namespace/:path/", async () => {
        let response;
        try {
            response = await preferenceApi.getPreference("nonexistant", "setting");
        }
        catch (ex) {
            console.dir(ex.errors);
            return fail();
        }

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
			data: null,
			success: true
		});
    });

    test("getServerResources - GET /prefs/server/resources/", async () => {
        const response = await preferenceApi.getServerResources();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            serverVersion: "7.17.2-0"
        });
    });

    test("createPreference - POST /prefs/preference/:namespace/:path/", async () => {
        let createSettingResponse;
        try {
            createSettingResponse = await preferenceApi.createPreference(newSetting);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(createSettingResponse.status).toEqual(200);
        newSetting.id = createSettingResponse.data.data.id;
        expect(createSettingResponse.data).toEqual({
			success: true,
			data: newSetting
		});



        let getNewSettingResponse;
        try {
            getNewSettingResponse = await preferenceApi.getPreference(newSetting.namespace, newSetting.path);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(getNewSettingResponse.status).toEqual(200);
        expect(getNewSettingResponse.data).toEqual({
			success: true,
			data: newSetting
		});



        let deleteSettingResponse;
        try {
            deleteSettingResponse = await preferenceApi.deletePreference(newSetting);
        }
        catch(e) {
            console.dir(e);
            return fail();
        }
        expect(deleteSettingResponse.status).toEqual(200);
        expect(deleteSettingResponse.data).toEqual({
			success: true,
			data: newSetting
		});




        let getRemovedSettingResponse;
        try {
            getRemovedSettingResponse = await preferenceApi.getPreference(newSetting.namespace, newSetting.path);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(getRemovedSettingResponse.status).toEqual(200);
        expect(getRemovedSettingResponse.data).toEqual({
			data: null,
			success: true
		});



        let prefResponse;
        try {
            prefResponse = await preferenceApi.createPreference(newPreference);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(prefResponse.status).toEqual(200);
        newPreference.id = prefResponse.data.data.id;
        expect(prefResponse.data).toEqual({
			success: true,
			data: newPreference
		});


		let getNewPreferenceResponse;
        try {
            getNewPreferenceResponse = await preferenceApi.getPreference(newPreference.namespace, newPreference.path);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
		expect(getNewPreferenceResponse.status).toEqual(200);
		expect(getNewPreferenceResponse.data).toEqual({
			success: true,
			data: newPreference
		});



		let deletePrefResponse;
        try {
            deletePrefResponse = await preferenceApi.deletePreference(newPreference);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
		expect(deletePrefResponse.status).toEqual(200);
		expect(deletePrefResponse.data).toEqual({
			success: true,
			data: newPreference
		});



		let getRemovedSettingResponse2;
        try {
            getRemovedSettingResponse2 = await preferenceApi.getPreference(newSetting.namespace, newSetting.path);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(getRemovedSettingResponse.status).toEqual(200);
        expect(getRemovedSettingResponse.data).toEqual({
			data: null,
			success: true
		});

    });

    test("updatePreference - POST /prefs/preference/:namespace/:path/", async () => {
        let updatedPref = PREFERENCES[1];
        let oldValue = updatedPref.value;


        let updateSettingResponse;
        updatedPref.value = "newValue";
        try {
            updateSettingResponse = await preferenceApi.updatePreference(updatedPref);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(updateSettingResponse.status).toEqual(200);
        expect(updateSettingResponse.data).toEqual({
			success: true,
			data: updatedPref
		});


        let updateSettingResponse2;
        updatedPref.value = oldValue;
        try {
            updateSettingResponse2 = await preferenceApi.updatePreference(updatedPref);
        }
        catch(e) {
            console.dir(e.errors);
            return fail();
        }
        expect(updateSettingResponse2.status).toEqual(200);
        expect(updateSettingResponse2.data).toEqual({
			success: true,
			data: updatedPref
		});
    });
});

import { NodeGateway } from "./NodeGateway";
import { ThemeAPI } from "../../src/api/clients/ThemeAPI";
import { logResponse } from "./assertions";
import { PreferenceAPI } from "../../src/api/clients/PreferenceAPI";

const LIGHT_THEME = "";
const DARK_THEME = "bp3-dark";

describe("Theme API", () => {
    let gateway: NodeGateway;
    let themeApi: ThemeAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        const preferenceApi = new PreferenceAPI(gateway);
        themeApi = new ThemeAPI(preferenceApi);

        await gateway.login("admin", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getTheme - GET prefs/preference/owf/selected_theme", async () => {
        const response = await themeApi.getTheme();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect([LIGHT_THEME, DARK_THEME]).toContain(response.data);
    });

    test("setTheme to dark theme - POST prefs/preference/owf/selected_theme", async () => {
        const response = await themeApi.setTheme(DARK_THEME);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(DARK_THEME);

        const checkPersisted = await themeApi.getTheme();
        expect(checkPersisted.data).toEqual(DARK_THEME);
    });

    test("setTheme to light theme - POST prefs/preference/owf/selected_theme", async () => {
        const response = await themeApi.setTheme(LIGHT_THEME);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(LIGHT_THEME);

        const checkPersisted = await themeApi.getTheme();
        expect(checkPersisted.data).toEqual(LIGHT_THEME);
    });

    test("setTheme to invalid theme - POST prefs/preference/owf/selected_theme", async () => {
        const response = await themeApi.setTheme('"<script>alert()</script>"class="');
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(DARK_THEME);

        const checkPersisted = await themeApi.getTheme();
        expect(checkPersisted.data).toEqual(DARK_THEME);
    });

    test("toggleTheme from dark to light - POST prefs/preference/owf/selected_theme", async () => {
        let response = await themeApi.toggle();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(LIGHT_THEME);

        const checkPersisted = await themeApi.getTheme();
        expect(checkPersisted.data).toEqual(LIGHT_THEME);
    });

    test("toggleTheme from light to dark - POST prefs/preference/owf/selected_theme", async () => {
        let response = await themeApi.toggle();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(DARK_THEME);

        const checkPersisted = await themeApi.getTheme();
        expect(checkPersisted.data).toEqual(DARK_THEME);
    });
});

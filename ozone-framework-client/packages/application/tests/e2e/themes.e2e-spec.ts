import "reflect-metadata";


import { NodeGateway } from "./node-gateway";
import { ThemeAPI } from "../../src/api/clients/ThemeAPI";

describe("Theme API", () => {
    let gateway: NodeGateway;
    let themeApi: ThemeAPI;
	let lightTheme: string;
	let darkTheme: string;
	let badTheme: string;

    beforeAll(async () => {
        gateway = new NodeGateway();
        themeApi = new ThemeAPI(gateway);
		lightTheme = "";
		darkTheme = "bp3-dark";
		badTheme = "\"<script>alert()</script>\"class=\"";

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getTheme - GET prefs/preference/owf/selected_theme", async () => {
        const response = await themeApi.getTheme();
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(darkTheme);
    });

    test("setTheme - POST prefs/preference/owf/selected_theme", async () => {

		let response = await themeApi.setTheme(lightTheme);
        expect(response.status).toEqual(200);
		expect(response.data).toEqual(lightTheme);

		let response2 = await themeApi.getTheme();
		expect(response2.data).toEqual(lightTheme);


        response = await themeApi.setTheme(badTheme);
        expect(response.status).toEqual(200);
		expect(response.data).toEqual(darkTheme);

        response2 = await themeApi.getTheme();
        expect(response2.data).toEqual(darkTheme);


		response = await themeApi.setTheme(lightTheme);
        expect(response.status).toEqual(200);
		expect(response.data).toEqual(lightTheme);

		response2 = await themeApi.getTheme();
		expect(response2.data).toEqual(lightTheme);


		response = await themeApi.setTheme(darkTheme);
        expect(response.status).toEqual(200);
		expect(response.data).toEqual(darkTheme);

		response2 = await themeApi.getTheme();
		expect(response2.data).toEqual(darkTheme);
    });

    test("toggleTheme - POST prefs/preference/owf/selected_theme", async () => {

		let response = await themeApi.getTheme();
		expect(response.data).toEqual(darkTheme);

		let response2 = await themeApi.toggle();
        expect(response2.status).toEqual(200);
		expect(response2.data).toEqual(lightTheme);

		response = await themeApi.getTheme();
		expect(response.data).toEqual(lightTheme);


		response2 = await themeApi.toggle();
        expect(response2.status).toEqual(200);
		expect(response2.data).toEqual(darkTheme);
		response = await themeApi.getTheme();
		expect(response.data).toEqual(darkTheme);
    });

});

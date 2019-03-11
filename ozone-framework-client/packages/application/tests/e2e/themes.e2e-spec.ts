import "reflect-metadata";


import { NodeGateway } from "./node-gateway";
import { mainStore } from "../../src/stores/MainStore";

describe("Theme set/retrieve", () => {
    let gateway: NodeGateway;
	let lightTheme: string;
	let darkTheme: string;
	let badTheme: string;

    beforeAll(async () => {
        gateway = new NodeGateway();
		lightTheme = "";
		darkTheme = "bp3-dark";
		badTheme = "\"<script>alert()</script>\"class=\"";

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getTheme - GET /user/", async () => {
        const response = mainStore.getTheme();
        expect(response).toEqual(darkTheme);
    });

    test("setTheme - GET /user/", async () => {

		await mainStore.setTheme(lightTheme);
		let response = mainStore.getTheme();
		expect(response).toEqual(lightTheme);


        await mainStore.setTheme(badTheme);
        response = mainStore.getTheme();
        expect(response).toEqual(darkTheme);


		await mainStore.setTheme(lightTheme);
		response = mainStore.getTheme();
		expect(response).toEqual(lightTheme);


		await mainStore.setTheme(darkTheme);
		response = mainStore.getTheme();
		expect(response).toEqual(darkTheme);
    });

    test("toggleTheme - GET /user/", async () => {

		let response = mainStore.getTheme();
		expect(response).toEqual(darkTheme);

		await mainStore.toggleTheme();
		response = mainStore.getTheme();
		expect(response).toEqual(lightTheme);


		await mainStore.toggleTheme();
		response = mainStore.getTheme();
		expect(response).toEqual(darkTheme);
    });

});

import { DashboardAPI } from "../../src/api/clients/DashboardAPI";
import { StackAPI } from "../../src/api/clients/StackAPI";
import { UserDashboardAPI } from "../../src/api/clients/UserDashboardAPI";

import { DashboardDTO } from "../../src/api/models/DashboardDTO";
import { StackDTO } from "../../src/api/models/StackDTO";

import { NodeGateway } from "./NodeGateway";

import { logResponse } from "./assertions";

describe("User Dashboard API", () => {
    let gateway: NodeGateway;

    let dashboardApi: DashboardAPI;
    let stackApi: StackAPI;
    let userDashboardApi: UserDashboardAPI;

    let initialDashboards: DashboardDTO[];
    let initialStacks: StackDTO[];

    beforeAll(async () => {
        gateway = new NodeGateway();

        dashboardApi = new DashboardAPI(gateway);
        stackApi = new StackAPI(gateway);
        userDashboardApi = new UserDashboardAPI(gateway);

        await gateway.login("user", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("get initial dashboards", async () => {
        const response = await dashboardApi.getDashboards();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({ results: 0 });

        initialDashboards = response.data.data;
    });

    test("get initial stacks", async () => {
        const response = await stackApi.getStacks();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({ results: 2 });

        initialStacks = response.data.data;
    });

    test(`get user dashboards - ${UserDashboardAPI.prototype.getOwnDashboards.name}`, async () => {
        const response = await userDashboardApi.getOwnDashboards();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data.dashboards).toHaveLength(0);
        expect(response.data.widgets).toHaveLength(6);
    });

    let newDashboard: DashboardDTO;

    test(`create a default dashboard and stack - ${UserDashboardAPI.prototype.createDefaultDashboard.name}`, async () => {
        const response = await userDashboardApi.createDefaultDashboard();
        logResponse(response);

        expect(response.status).toEqual(200);

        newDashboard = response.data;
    });

    test(`get user dashboards (after creating default) - ${UserDashboardAPI.prototype.getOwnDashboards.name}`, async () => {
        const response = await userDashboardApi.getOwnDashboards();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data.dashboards).toHaveLength(1);
    });

    test(`delete the new stack - ${StackAPI.prototype.deleteStackAsUser.name}`, async () => {
        if (!newDashboard.stack) return fail("no stack?");

        const response = await stackApi.deleteStackAsUser(newDashboard.stack.id);
        logResponse(response);

        expect(response.status).toEqual(200);
    });

    test(`get user dashboards (after deleting stack) - ${UserDashboardAPI.prototype.getOwnDashboards.name}`, async () => {
        const response = await userDashboardApi.getOwnDashboards();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data.dashboards).toHaveLength(0);
    });

    test("cleanup - remove stacks and dashboard", async () => {
        await gateway.login("admin", "password");

        const initialResponse = await stackApi.getStacks();
        logResponse(initialResponse);

        expect(initialResponse.status).toEqual(200);
        expect(initialResponse.data).toMatchObject({ results: initialStacks.length + 1 });

        if (!newDashboard.stack) return fail("no stack?");

        const deleteResponse = await stackApi.deleteStackAsAdmin(newDashboard.stack.id);
        expect(deleteResponse.status).toEqual(200);

        const cleanedStacksResponse = await stackApi.getStacks();
        logResponse(cleanedStacksResponse);

        expect(cleanedStacksResponse.status).toEqual(200);
        expect(cleanedStacksResponse.data).toMatchObject({ results: initialStacks.length });

        const cleanedDashboardResponse = await dashboardApi.getDashboards();
        logResponse(cleanedDashboardResponse);

        expect(cleanedDashboardResponse.status).toEqual(200);
        expect(cleanedDashboardResponse.data).toMatchObject({ results: initialDashboards.length });
    });
});

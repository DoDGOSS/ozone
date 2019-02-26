import "reflect-metadata";

import {StackAPI, StackCreateRequest, StackUpdateRequest} from "../../src/api";

import { NodeGateway } from "./node-gateway";
import { STACKS } from "../unit/data";



describe("Stack API", () => {

    let gateway: NodeGateway;
    let stackApi: StackAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        stackApi = new StackAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getStacks - GET /stack/", async () => {
        const response = await stackApi.getStacks();
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "results": 3,
            "data": STACKS
        });
    });

    test("getStackById - GET /stack/:id/", async () => {
        const response = await stackApi.getStackById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "results": 1,
            "data": [STACKS[0]]
        });
    });

    const createRequest: StackCreateRequest = {
        name: "Stack 1",
        stackContext: "12945678-1234-1234-1234-1234567890a7",
        description: "Default"
    };

    test("createStack - POST /stack/", async () => {
        const createResponse = await stackApi.createStack(createRequest);

        expect(createResponse.status).toEqual(200);
        expect(createResponse.data).toEqual({
            success: true,
            data: [
                {
                    approved: false,
                    imageUrl: null,
                    owner: null,
                    totalUsers: 1,
                    totalGroups: 0,
                    id: 4,
                    groups: [],
                    stackContext: "12945678-1234-1234-1234-1234567890a7",
                    defaultGroup: {
                        stackDefault: true,
                        totalStacks: 0,
                        status: "active",
                        totalUsers: 0,
                        id: expect.any(Number),
                        description: "",
                        totalWidgets: 0,
                        email: null,
                        name: expect.any(String),
                        automatic: false,
                        displayName: null
                    },
                    descriptorUrl: null,
                    description: "Default",
                    totalWidgets: 0,
                    name: "Stack 1",
                    totalDashboards: 0
                }
            ]
        });
    });

    test("updateStack - PUT /stack/:id/", async () => {
        const updateRequest = {...createRequest, description: "Description Updated", id: 4};
        const response = await stackApi.updateStack(updateRequest);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [
                {
                    approved: false,
                    imageUrl: null,
                    owner: null,
                    totalUsers: 1,
                    totalGroups: 0,
                    id: 4,
                    groups: [],
                    stackContext: "12945678-1234-1234-1234-1234567890a7",
                    defaultGroup: {
                        stackDefault: true,
                        totalStacks: 0,
                        status: "active",
                        totalUsers: 0,
                        id: expect.any(Number),
                        description: "",
                        totalWidgets: 0,
                        email: null,
                        name: expect.any(String),
                        automatic: false,
                        displayName: null
                    },
                    descriptorUrl: null,
                    description: "Description Updated",
                    totalWidgets: 0,
                    name: "Stack 1",
                    totalDashboards: 0
                }
            ]
        });

    });

    test("deleteStack - DELETE /stack/:id/", async () => {
        const deleteRequest = { ...createRequest, id: 4 };
        const response = await stackApi.deleteStack(deleteRequest.id, { adminEnabled: true });
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [{ id: deleteRequest.id }]
        });
    });
});



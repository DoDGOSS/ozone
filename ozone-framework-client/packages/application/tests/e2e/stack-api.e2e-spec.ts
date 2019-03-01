import "reflect-metadata";

import { StackAPI } from "../../src/api/clients/StackAPI";
import { StackCreateRequest, StackDTO, StackUpdateRequest } from "../../src/api/models/StackDTO";

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
            results: 3,
            data: STACKS
        });
    });

    test("getStackById - GET /stack/:id/", async () => {
        const response = await stackApi.getStackById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            results: 1,
            data: [STACKS[0]]
        });
    });

    describe("create, update, and delete", () => {
        let stack: StackDTO;

        test("createStack - POST /stack/", async () => {
            const request: StackCreateRequest = {
                name: "Stack 1",
                stackContext: "12945678-1234-1234-1234-1234567890a7",
                description: "Default"
            };

            const createResponse = await stackApi.createStack(request);

            expect(createResponse.status).toEqual(200);
            expect(createResponse.data).toEqual({
                success: true,
                data: [
                    {
                        id: expect.any(Number),
                        stackContext: request.stackContext,
                        description: request.description,
                        name: request.name,
                        approved: false,
                        imageUrl: null,
                        owner: null,
                        totalUsers: 1,
                        totalGroups: 0,
                        groups: [],
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
                        totalWidgets: 0,
                        totalDashboards: 0
                    }
                ]
            });

            stack = createResponse.data.data[0];
        });

        test("updateStack - PUT /stack/:id/", async () => {
            const request: StackUpdateRequest = {
                id: stack.id,
                name: stack.name,
                stackContext: stack.stackContext,
                description: "Description Updated"
            };

            const response = await stackApi.updateStack(request);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [
                    {
                        id: request.id,
                        name: request.name,
                        stackContext: request.stackContext,
                        description: request.description,
                        approved: false,
                        imageUrl: null,
                        owner: null,
                        totalUsers: 1,
                        totalGroups: 0,
                        groups: [],
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
                        totalWidgets: 0,
                        totalDashboards: 0
                    }
                ]
            });
        });

        test("deleteStack - DELETE /stack/:id/", async () => {
            const response = await stackApi.deleteStack(stack.id, { adminEnabled: true });

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [{ id: stack.id }]
            });
        });
    });
});

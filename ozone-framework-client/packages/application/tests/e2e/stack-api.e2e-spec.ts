import "reflect-metadata";

import { StackAPI, StackUpdateRequest } from "../../src/api";

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
        try {
            const response = await stackApi.getStacks();
            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                "results": 3,
                "data": STACKS
            });
        } catch (ex) {
            console.dir(ex.errors);
        }

    });

    test("getStackById - GET /stack/:id/", async () => {
        const response = await stackApi.getStackById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "results": 1,
            "data": [STACKS[0]]
        });
    });

    const createRequest: StackUpdateRequest = {
        name: "Stack 1",
        stackContext: "12945678-1234-1234-1234-1234567890a7"
    };

    test("createStack - POST /stack/", async () => {
        const createResponse = await stackApi.createStack(createRequest);

        expect(createResponse.status).toEqual(200);
        // expect(createResponse.data).toEqual({
        //     success: true,
        //     data: [{
        //         approved: false,
        //         imageUrl: null,
        //         owner: null,
        //         totalUsers: 1,
        //         totalGroups: 0,
        //         id: expect.any(Number),
        //         groups: [],
        //         stackContext: createRequest.stackContext,
        //         // defaultGroup: {
        //         //     stackDefault: true,
        //         //     totalStacks: 0,
        //         //     status: active,
        //         //     totalUsers: 0,
        //         //     id: 12,
        //         //     description: ,
        //         //     totalWidgets: 0,
        //         //     email: null,
        //         //     name: f2055b87-6f1d-4ec3-bbc7-52e4af7fcbe3,
        //         //     automatic: false,
        //         //     displayName: null
        //         // },
        //         descriptorUrl: null,
        //         description: null,
        //         totalWidgets: 0,
        //         name: createRequest.name,
        //         totalDashboards: 0,
        //     }]
        });

    test("deleteStack - DELETE /stack/:id/", async () => {
        const response = await stackApi.deleteStack(4);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({ stackContext: createRequest.stackContext });

    });




});



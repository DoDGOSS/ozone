import "reflect-metadata";

import { GroupAPI, GroupCreateRequest, GroupDTO, GroupUpdateRequest } from "../..";

import { NodeGateway } from "./node-gateway";
import { GROUPS } from "../../models/__test__/data";


describe("Group API", () => {

    let gateway: NodeGateway;
    let groupApi: GroupAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        groupApi = new GroupAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getGroups - GET /group/", async () => {
        const response = await groupApi.getGroups();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            results: 2,
            data: GROUPS
        });
    });

    test("getGroupById - GET /group/:id/", async () => {
        const response = await groupApi.getGroupById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            results: 1,
            data: [GROUPS[0]]
        });
    });

    describe("create, update, and delete", () => {

        let group: GroupDTO;

        test("createGroup - POST /group/", async () => {
            const request: GroupCreateRequest = {
                name: "Test Group 2"
            };

            const response = await groupApi.createGroup(request);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [
                    {
                        id: expect.any(Number),
                        name: request.name,
                        displayName: request.name,
                        automatic: false,
                        description: null,
                        email: null,
                        stackDefault: false,
                        status: "active",
                        totalStacks: 0,
                        totalUsers: 0,
                        totalWidgets: 0
                    }
                ]
            });

            group = response.data.data[0];
        });

        test("updateGroup - PUT /group/:id/", async () => {
            const request: GroupUpdateRequest = {
                id: group.id,
                name: "Test Group Update",
                displayName: "Test Group Update Display",
                description: group.description,
                email: group.email,
                automatic: group.automatic,
                status: group.status,
                active: group.status === 'active'
            };

            const response = await groupApi.updateGroup(request);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [
                    {
                        id: request.id,
                        name: request.name,
                        displayName: request.displayName,
                        automatic: request.automatic,
                        description: request.description,
                        email: request.email,
                        status: request.status,
                        stackDefault: false,
                        totalStacks: 0,
                        totalUsers: 0,
                        totalWidgets: 0
                    }
                ]
            });
        });

        test("deleteGroup - POST (override) /group/", async () => {
            const response = await groupApi.deleteGroup(group.id);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [{
                    id: group.id
                }]
            });
        });

    });

});


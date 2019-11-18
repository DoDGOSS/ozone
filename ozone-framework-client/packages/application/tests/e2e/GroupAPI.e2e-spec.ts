import "./matchers";

import { GroupAPI } from "../../src/api/clients/GroupAPI";
import { GroupCreateRequest, GroupDTO, GroupUpdateRequest } from "../../src/api/models/GroupDTO";

import { NodeGateway } from "./NodeGateway";

import { optional } from "../../src/utility";

describe("Group API", () => {
    let gateway: NodeGateway;
    let groupApi: GroupAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        groupApi = new GroupAPI(gateway);

        await gateway.login("admin", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    let initialGroups: GroupDTO[];

    test("getGroups - GET /group/", async () => {
        const response = await groupApi.getGroups();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            results: 2,
            data: expect.arrayOfLength(2)
        });

        initialGroups = response.data.data;
    });

    test("getGroupById - GET /group/:id/", async () => {
        const response = await groupApi.getGroupById(initialGroups[0].id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            results: 1,
            data: [initialGroups[0]]
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
                description: optional(group.description),
                email: optional(group.email),
                automatic: group.automatic,
                status: group.status,
                active: group.status === "active"
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
                        description: group.description,
                        email: group.email,
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
                data: [
                    {
                        id: group.id
                    }
                ]
            });
        });
    });
});

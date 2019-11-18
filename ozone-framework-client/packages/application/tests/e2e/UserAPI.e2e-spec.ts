import { UserAPI } from "../../src/api/clients/UserAPI";
import { UserDTO } from "../../src/api/models/UserDTO";

import { NodeGateway } from "./NodeGateway";
import { USERS } from "../unit/data";

describe("User API", () => {
    let gateway: NodeGateway;
    let userApi: UserAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        userApi = new UserAPI(gateway);

        await gateway.login("admin", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getUsers - GET /user/", async () => {
        const response = await userApi.getUsers();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 2,
            data: USERS
        });
    });

    test("getUsers limit 1 - GET /user/", async () => {
        const response = await userApi.getUsers({ limit: 1 });

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 2,
            data: [USERS[0]]
        });
    });

    test("getUserById - GET /user/:id/", async () => {
        const response = await userApi.getUserById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 1,
            data: [USERS[0]]
        });
    });

    test("getUserById not found - GET /user/:id/", async () => {
        const response = await userApi.getUserById(0);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 0,
            data: []
        });
    });

    describe("create, update, and delete", () => {
        let user: UserDTO;

        test("createUser - POST /user/", async () => {
            const request = {
                username: "user1",
                userRealName: "Test User 1",
                email: "user1@mail.com"
            };

            const response = await userApi.createUser(request);

            expect(response.status).toEqual(200);
            expect(response.data).toMatchObject({
                success: true,
                data: [
                    {
                        id: expect.any(Number),
                        username: request.username,
                        userRealName: request.userRealName,
                        email: request.email,
                        hasPWD: null,
                        lastLogin: null,
                        totalDashboards: 0,
                        totalGroups: 0,
                        totalStacks: 0,
                        totalWidgets: 0
                    }
                ]
            });

            user = response.data.data[0];
        });

        test("updateUser - PUT /user/:id/", async () => {
            const request = {
                id: user.id,
                username: user.username,
                userRealName: "Test User 2",
                email: user.email
            };

            const response = await userApi.updateUser(request);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [
                    {
                        id: request.id,
                        username: request.username,
                        userRealName: request.userRealName,
                        email: request.email,
                        hasPWD: null,
                        lastLogin: null,
                        totalDashboards: 0,
                        totalGroups: 0,
                        totalStacks: 0,
                        totalWidgets: 0
                    }
                ]
            });
        });

        test("deleteUser - POST (override) /user/", async () => {
            const response = await userApi.deleteUser(user.id);

            expect(response.status).toEqual(200);
            expect(response.data).toEqual({
                success: true,
                data: [
                    {
                        id: user.id
                    }
                ]
            });
        });
    });
});

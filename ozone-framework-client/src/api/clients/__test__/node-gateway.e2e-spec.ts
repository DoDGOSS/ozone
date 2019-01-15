import "reflect-metadata";

import { NodeGateway } from "./node-gateway";


test("login (POST /perform_login)", async () => {
    const gateway = new NodeGateway();
    const loginResponse = await gateway.login("testAdmin1", "password");

    expect(loginResponse.status).toEqual(200);

    expect(gateway.isAuthenticated).toBeTruthy();
});

test("logout (GET /logout)", async () => {
    const gateway = new NodeGateway();
    const logoutResponse = await gateway.logout();

    expect(logoutResponse.status).toEqual(200);

    expect(gateway.isAuthenticated).toBeFalsy();
});

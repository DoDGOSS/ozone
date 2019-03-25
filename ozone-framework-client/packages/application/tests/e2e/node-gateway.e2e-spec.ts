import { NodeGateway } from "./node-gateway";

test("login (POST /perform_login)", async () => {
    const gateway = new NodeGateway();
    const loginResponse = await gateway.login("testAdmin1", "password");

    expect(loginResponse.status).toEqual(200);

    expect(gateway.isAuthenticated).toBeTruthy();
});

test.skip("logout (GET /logout)", async () => {
    const gateway = new NodeGateway();
    try {
        await gateway.logout();
    } catch (ex) {
        expect(ex.response.status).toEqual(401);
    }
    expect(gateway.isAuthenticated).toBeFalsy();
    await gateway.login("testAdmin1", "password");
    expect(gateway.isAuthenticated).toBeTruthy();
});

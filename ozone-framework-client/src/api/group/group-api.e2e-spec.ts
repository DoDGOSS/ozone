import { GroupAPI } from "./group-api";

import { NodeGateway } from "../__test__/node-gateway";
import { GROUPS } from "../__test__/data";


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
            "results": 2,
            "data": GROUPS
        });
    });

    test("getGroupById - GET /group/:id/", async () => {
        const response = await groupApi.getGroupById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "results": 1,
            "data": [GROUPS[0]]
        });
    });

});


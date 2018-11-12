import { WidgetTypeAPI } from "./widget-type-api";

import { NodeGateway } from "../__test__/node-gateway";
import { WIDGET_TYPES } from "../__test__/data";


describe("Widget Type API", () => {

    let gateway: NodeGateway;
    let widgetTypeApi: WidgetTypeAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetTypeApi = new WidgetTypeAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getWidgetTypes - GET /widgettype/list/", async () => {
        const response = await widgetTypeApi.getWidgetTypes();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "success": true,
            "results": 5,
            "data": WIDGET_TYPES
        });
    });

});

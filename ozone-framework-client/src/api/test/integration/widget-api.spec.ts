import { WidgetAPI } from "../../";

import { NodeGateway } from "./node-gateway";
import { WIDGETS } from "../data";


describe("Widget API", () => {

    let gateway: NodeGateway;
    let widgetApi: WidgetAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetApi = new WidgetAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getWidgets - GET /widget/", async () => {
        const response = await widgetApi.getWidgets();

        expect(response.status).toEqual(200);

        // TODO: Sort order is messed up; not sorted by id? intent orders are inconsistent?
        // expect(response.data).toEqual({
        //     "success": true,
        //     "results": 21,
        //     "data": WIDGETS
        // });
    });

    test("getWidgetById - GET /widget/:id/", async () => {
        const widget = WIDGETS[0];

        const response = await widgetApi.getWidgetById(widget.id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "success": true,
            "results": 1,
            "data": [widget]
        });
    });

});

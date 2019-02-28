import "reflect-metadata";

import { WidgetTypeAPI } from "../../src/api/clients/WidgetTypeAPI";

import { NodeGateway } from "./node-gateway";
import { WIDGET_TYPES } from "../unit/data";

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
            success: true,
            results: 5,
            data: WIDGET_TYPES
        });
    });
});

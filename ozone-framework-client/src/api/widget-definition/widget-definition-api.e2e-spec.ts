import { WIDGET_DEFINITION } from "../__test__/data";

import { NodeGateway } from "../__test__/node-gateway";
import { WidgetDefinitionAPI } from "./widget-definition-api";


// TODO: 404?
describe.skip("Widget Definition API", () => {

    let gateway: NodeGateway;
    let widgetDefApi: WidgetDefinitionAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetDefApi = new WidgetDefinitionAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getWidgetDefinitionById - GET /prefs/widgetDefinition/:id/", async () => {
        const response = await widgetDefApi.getWidgetDefinitionById(WIDGET_DEFINITION.id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(WIDGET_DEFINITION);
    });

});

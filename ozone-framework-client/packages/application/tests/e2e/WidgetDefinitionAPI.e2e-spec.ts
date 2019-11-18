import { WidgetDefinitionAPI } from "../../src/api/clients/WidgetDefinitionAPI";

import { NodeGateway } from "./NodeGateway";

import { WIDGET_DEFINITION } from "../unit/data";
import { logResponse } from "./assertions";

// TODO: 404?
describe("Widget Definition API", () => {
    let gateway: NodeGateway;
    let widgetDefApi: WidgetDefinitionAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetDefApi = new WidgetDefinitionAPI(gateway);

        await gateway.login("admin", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getWidgetDefinitions - GET /prefs/widgetDefinition/", async () => {
        // This response returns 21 widgets, the first ten of which are the same as WIDGETS[0:9], and none of which
        // include WIDGET_DEFINITION. What should this be returning?
        const response = await widgetDefApi.getWidgetDefinitions();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            results: 11
        });
    });

    test.skip("getWidgetDefinitionById - GET /prefs/widgetDefinition/:id/", async () => {
        const response = await widgetDefApi.getWidgetDefinitionById(WIDGET_DEFINITION.id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(WIDGET_DEFINITION);
    });

    test.skip("groupOwnsWidget - POST /widgetDefinition/groupOwnedWidget/ - basic", async () => {
        const response = await widgetDefApi.groupOwnsWidget({
            widgetId: WIDGET_DEFINITION.id,
            personId: 1,
            isAdmin: "true"
        });

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ isOwnedByGroup: true });
    });

    test("groupOwnsWidget - POST /widgetDefinition/groupOwnedWidget/ - invalid user", async () => {
        // test invalid user - note the personId isn't checked for 'OWF-User'-level widgets,
        // so this needs to query a widget definition with specifically admin privileges.
        // const response = await widgetDefApi.groupOwnsWidget({
        //     widgetId: ,
        //     personId: 1234568,
        //     isAdmin: 'false'
        // });
        //
        // expect(response.status).toEqual(200);
        // expect(response.data).toEqual({ isOwnedByGroup: true });
    });

    test("groupOwnsWidget - POST /widgetDefinition/groupOwnedWidget/ - invalid widget", async () => {
        const response = await widgetDefApi.groupOwnsWidget({
            widgetId: "Not-a-widget",
            personId: 1,
            isAdmin: "true"
        });

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ isOwnedByGroup: false });
    });
});

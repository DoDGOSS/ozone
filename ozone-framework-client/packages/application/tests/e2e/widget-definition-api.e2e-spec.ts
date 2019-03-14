import "reflect-metadata";

import { WidgetDefinitionAPI } from "../../src/api/clients/WidgetDefinitionAPI";


import { GROUPS } from "../unit/data";
import { GroupAPI } from "../../src/api/clients/GroupAPI";
import { GroupCreateRequest, GroupDTO, GroupUpdateRequest } from "../../src/api/models/GroupDTO";

import { NodeGateway } from "./node-gateway";
import { WIDGET_DEFINITION } from "../unit/data";

// TODO: 404?
describe("Widget Definition API", () => {
    let gateway: NodeGateway;
	let groupApi: GroupAPI;
    let widgetDefApi: WidgetDefinitionAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetDefApi = new WidgetDefinitionAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test.skip("getWidgetDefinitionById - GET /prefs/widgetDefinition/:id/", async () => {
        const response = await widgetDefApi.getWidgetDefinitionById(WIDGET_DEFINITION.id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(WIDGET_DEFINITION);
    });

    test("groupOwnsWidget - POST /widgetDefinition/groupOwnedWidget/", async () => {
        const response = await widgetDefApi.groupOwnsWidget({
			widgetId: '679294b3-ccc3-4ace-a061-e3f27ed86451',
			personId: 'testAdmin1',
			isAdmin: 'true'
		});
		console.dir(response.data)

        expect(response.status).toEqual(200);
        // expect(response.data).toEqual(WIDGET_DEFINITION);
    });

});

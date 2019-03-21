import "reflect-metadata";

import { WidgetAPI } from "../../src/api/clients/WidgetAPI";
import { WidgetCreateRequest, WidgetCreateResponse, WidgetUpdateRequest } from "../../src/api/models/WidgetDTO";

import { NodeGateway } from "./node-gateway";
import { WIDGETS } from "../unit/data";

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
        expect(response.data).toMatchObject({
            success: true,
            results: 21
        });
    });

    test("getWidgetById - GET /widget/:id/", async () => {
        const widget = WIDGETS[0];

        const response = await widgetApi.getWidgetById(widget.id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 1,
            data: [widget]
        });
    });

    let createRequest: WidgetCreateRequest;
    let createResponse: WidgetCreateResponse;

    test("createWidget - POST /widget/", async () => {
        createRequest = {
            displayName: "My Test Widget",
            widgetVersion: "1.0",
            description: "A test widget",
            widgetUrl: "http://www.ozone.test/widget1/",
            imageUrlSmall: "http://www.ozone.test/widget1/small_icon.png",
            imageUrlMedium: "http://www.ozone.test/widget1/large_icon.png",
            width: 200,
            height: 200,
            widgetGuid: "12345678-1234-1234-1234-1234567890a0",
            universalName: "TestWidget.ozone.test",
            visible: true,
            background: false,
            singleton: false,
            mobileReady: false,
            widgetTypes: [
                {
                    id: 1,
                    name: "standard"
                }
            ]
        };

        const response = await widgetApi.createWidget(createRequest);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [
                {
                    id: createRequest.widgetGuid,
                    namespace: "widget",
                    path: createRequest.widgetGuid,
                    value: {
                        universalName: createRequest.universalName,
                        namespace: createRequest.displayName,
                        description: createRequest.description,
                        url: createRequest.widgetUrl,
                        headerIcon: createRequest.imageUrlSmall,
                        smallIconUrl: createRequest.imageUrlSmall,
                        mediumIconUrl: createRequest.imageUrlMedium,
                        image: createRequest.imageUrlMedium,
                        width: createRequest.width,
                        height: createRequest.height,
                        x: 0,
                        y: 0,
                        minimized: false,
                        maximized: false,
                        widgetVersion: createRequest.widgetVersion,
                        totalUsers: 0,
                        totalGroups: 0,
                        singleton: createRequest.singleton,
                        visible: createRequest.visible,
                        background: createRequest.background,
                        mobileReady: createRequest.mobileReady,
                        descriptorUrl: null,
                        definitionVisible: true,
                        directRequired: [],
                        allRequired: [],
                        intents: {
                            send: [],
                            receive: []
                        },
                        widgetTypes: [
                            {
                                id: createRequest.widgetTypes[0].id,
                                name: createRequest.widgetTypes[0].name,
                                displayName: createRequest.widgetTypes[0].name
                            }
                        ]
                    }
                }
            ]
        });

        createResponse = response.data;
    });

    test("getWidgets - GET /widget/ - additional result after created", async () => {
        const response = await widgetApi.getWidgets();

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            results: 22
        });
    });

    test("updateWidget - PUT /widget/:guid/", async () => {
        const updateRequest: WidgetUpdateRequest = {
            ...createRequest,
            id: createResponse.data[0].id,
            intents: {
                send: [
                    {
                        action: "action",
                        dataTypes: ["application/json"]
                    }
                ],
                receive: []
            }
        };

        const response = await widgetApi.updateWidget(updateRequest);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [
                {
                    id: createRequest.widgetGuid,
                    namespace: "widget",
                    path: createRequest.widgetGuid,
                    value: {
                        universalName: createRequest.universalName,
                        namespace: createRequest.displayName,
                        description: createRequest.description,
                        url: createRequest.widgetUrl,
                        headerIcon: createRequest.imageUrlSmall,
                        image: createRequest.imageUrlMedium,
                        smallIconUrl: createRequest.imageUrlSmall,
                        mediumIconUrl: createRequest.imageUrlMedium,
                        width: createRequest.width,
                        height: createRequest.height,
                        x: 0,
                        y: 0,
                        minimized: false,
                        maximized: false,
                        widgetVersion: createRequest.widgetVersion,
                        totalUsers: 0,
                        totalGroups: 0,
                        singleton: createRequest.singleton,
                        visible: createRequest.visible,
                        background: createRequest.background,
                        mobileReady: createRequest.mobileReady,
                        descriptorUrl: null,
                        definitionVisible: true,
                        directRequired: [],
                        allRequired: [],
                        intents: {
                            send: [
                                {
                                    action: "action",
                                    dataTypes: ["application/json"]
                                }
                            ],
                            receive: []
                        },                        
                        widgetTypes: [
                            {
                                id: createRequest.widgetTypes[0].id,
                                name: createRequest.widgetTypes[0].name,
                                displayName: createRequest.widgetTypes[0].name
                            }
                        ]
                    }
                }
            ]
        });
    });

    test("addWidgetUsers - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.addWidgetUsers(widget.id, 1);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test("removeWidgetUsers - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.removeWidgetUsers(widget.id, 1);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test("addWidgetGroups - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.addWidgetGroups(widget.id, 1);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test("removeWidgetGroups - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.removeWidgetGroups(widget.id, 1);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test("deleteWidget - DELETE /widget/", async () => {
        const response = await widgetApi.deleteWidget(createRequest.widgetGuid);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [
                {
                    id: createRequest.widgetGuid,
                    value: {}
                }
            ]
        });

        const response2 = await widgetApi.getWidgets();

        expect(response2.status).toEqual(200);
        expect(response2.data).toMatchObject({
            success: true,
            results: 21
        });
    });
});

import "./matchers";

import { UserWidgetAPI } from "../../src/api/clients/UserWidgetAPI";
import { WidgetAPI } from "../../src/api/clients/WidgetAPI";

import { AuthUserDTO } from "../../src/api/models/AuthUserDTO";
import {
    WidgetCreateRequest,
    WidgetCreateResponse,
    WidgetDTO,
    WidgetUpdateRequest
} from "../../src/api/models/WidgetDTO";

import { NodeGateway } from "./node-gateway";

import { logResponse } from "./assertions";

describe("Widget API", () => {
    let gateway: NodeGateway;
    let widgetApi: WidgetAPI;
    let userWidgetApi: UserWidgetAPI;

    let testAdmin1: AuthUserDTO;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetApi = new WidgetAPI(gateway);
        userWidgetApi = new UserWidgetAPI(gateway);

        const loginResponse = await gateway.login("testAdmin1", "password");
        testAdmin1 = loginResponse.data;

        expect(gateway.isAuthenticated).toEqual(true);
    });

    let initialWidgets: WidgetDTO[];

    test("getWidgets - GET /widget/", async () => {
        const response = await widgetApi.getWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 11,
            data: expect.arrayOfLength(11)
        });

        initialWidgets = response.data.data;
    });

    test("getWidgetById - GET /widget/:id/", async () => {
        const response = await widgetApi.getWidgetById(initialWidgets[0].id);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: 1,
            data: [initialWidgets[0]]
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
            ],
            intents: {
                send: [],
                receive: []
            }
        };

        const response = await widgetApi.createWidget(createRequest);
        logResponse(response);

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
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: initialWidgets.length + 1,
            data: expect.arrayOfLength(initialWidgets.length + 1)
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
        logResponse(response);

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

    let userWidgets: number;

    test(`${UserWidgetAPI.prototype.getUserWidgets.name} -- before add`, async () => {
        const response = await userWidgetApi.getUserWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        userWidgets = response.data.length;
    });

    test("addWidgetUsers - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.addWidgetUsers(widget.id, testAdmin1.id);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test(`${UserWidgetAPI.prototype.getUserWidgets.name} -- after add / before remove`, async () => {
        const response = await userWidgetApi.getUserWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toHaveLength(userWidgets + 1);
    });

    test("removeWidgetUsers - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.removeWidgetUsers(widget.id, testAdmin1.id);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test(`${UserWidgetAPI.prototype.getUserWidgets.name} -- after remove`, async () => {
        const response = await userWidgetApi.getUserWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toHaveLength(userWidgets);
    });

    test("addWidgetGroups - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.addWidgetGroups(widget.id, 1);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test("removeWidgetGroups - PUT /widget/:guid/", async () => {
        const widget = createResponse.data[0];
        const response = await widgetApi.removeWidgetGroups(widget.id, 1);
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: 1 }]
        });
    });

    test("deleteWidget - DELETE /widget/", async () => {
        const response = await widgetApi.deleteWidget(createRequest.widgetGuid);
        logResponse(response);

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
        logResponse(response2);

        expect(response2.status).toEqual(200);
        expect(response2.data).toEqual({
            success: true,
            results: 11,
            data: expect.arrayOfLength(11)
        });
    });
});

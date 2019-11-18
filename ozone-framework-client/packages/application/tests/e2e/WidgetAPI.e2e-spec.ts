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

import { NodeGateway } from "./NodeGateway";

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

        const loginResponse = await gateway.login("admin", "password");
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

    test("getDependentWidgets - GET /widgetDefinition/dependents/", async () => {
        const response = await widgetApi.getDependentWidgets("782d37fa-b9cc-4af6-a4da-98913aebdf0a");
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            data: [{ id: "6bc58b1d-a771-40e7-932b-e3e23044cc85" }]
        });
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

    let createRequestMinimal: WidgetCreateRequest;
    test("createWidget - POST /widget/ - minimal", async () => {
        createRequestMinimal = {
            displayName: "My Test Widget",
            widgetVersion: "",
            description: "",
            widgetUrl: "http://www.ozone.test/widget1/",
            imageUrlSmall: "http://www.ozone.test/widget1/small_icon.png",
            imageUrlMedium: "http://www.ozone.test/widget1/large_icon.png",
            width: 200,
            height: 200,
            widgetGuid: "12345678-1234-1234-1234-1234567890ab",
            universalName: "",
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

        const response = await widgetApi.createWidget(createRequestMinimal);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [
                {
                    id: createRequestMinimal.widgetGuid,
                    namespace: "widget",
                    path: createRequestMinimal.widgetGuid,
                    value: {
                        universalName: null,
                        namespace: createRequestMinimal.displayName,
                        description: null,
                        url: createRequestMinimal.widgetUrl,
                        headerIcon: createRequestMinimal.imageUrlSmall,
                        smallIconUrl: createRequestMinimal.imageUrlSmall,
                        mediumIconUrl: createRequestMinimal.imageUrlMedium,
                        image: createRequestMinimal.imageUrlMedium,
                        width: createRequestMinimal.width,
                        height: createRequestMinimal.height,
                        x: 0,
                        y: 0,
                        minimized: false,
                        maximized: false,
                        widgetVersion: null,
                        totalUsers: 0,
                        totalGroups: 0,
                        singleton: createRequestMinimal.singleton,
                        visible: createRequestMinimal.visible,
                        background: createRequestMinimal.background,
                        mobileReady: createRequestMinimal.mobileReady,
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
                                id: createRequestMinimal.widgetTypes[0].id,
                                name: createRequestMinimal.widgetTypes[0].name,
                                displayName: createRequestMinimal.widgetTypes[0].name
                            }
                        ]
                    }
                }
            ]
        });
    });

    test("getWidgets - GET /widget/ - additional result after created", async () => {
        const response = await widgetApi.getWidgets();
        logResponse(response);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            results: initialWidgets.length + 2,
            data: expect.arrayOfLength(initialWidgets.length + 2)
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
        const response = await widgetApi.addWidgetUsers(widget.id, [testAdmin1.id]);
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
        const getResponse = await widgetApi.getWidgets();
        logResponse(getResponse);
        expect(getResponse.status).toEqual(200);
        expect(getResponse.data).toMatchObject({
            success: true,
            results: initialWidgets.length + 2,
            data: expect.arrayOfLength(initialWidgets.length + 2)
        });

        const deleteResponse = await widgetApi.deleteWidget(createRequest.widgetGuid);
        logResponse(deleteResponse);

        expect(deleteResponse.status).toEqual(200);
        expect(deleteResponse.data).toEqual({
            success: true,
            data: [
                {
                    id: createRequest.widgetGuid,
                    value: {}
                }
            ]
        });

        const deleteResponse2 = await widgetApi.deleteWidget(createRequestMinimal.widgetGuid);
        logResponse(deleteResponse2);
        expect(deleteResponse2.status).toEqual(200);
        expect(deleteResponse2.data).toEqual({
            success: true,
            data: [
                {
                    id: createRequestMinimal.widgetGuid,
                    value: {}
                }
            ]
        });

        const getResponse2 = await widgetApi.getWidgets();
        logResponse(getResponse2);
        expect(getResponse2.status).toEqual(200);
        expect(getResponse2.data).toEqual({
            success: true,
            results: initialWidgets.length,
            data: expect.arrayOfLength(initialWidgets.length)
        });
    });
});

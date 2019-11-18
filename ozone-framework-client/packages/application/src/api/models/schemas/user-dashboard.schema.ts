import { INTENTS_SCHEMA } from "./intent.schema";
import { WIDGET_TYPE_SCHEMA } from "./widget.schema";

export const USER_DASHBOARD_USER_SCHEMA = {
    title: "UserDashboard_User",
    type: "object",
    required: ["email", "id", "lastLogin", "username", "userRealName"],
    additionalProperties: true,
    properties: {
        email: {
            type: "string"
        },
        id: {
            type: "number"
        },
        lastLogin: {
            type: ["string", "null"]
        },
        username: {
            type: "string"
        },
        userRealName: {
            type: "string"
        }
    }
};

export const USER_DASHBOARD_STACK_SCHEMA = {
    title: "UserDashboard_Stack",
    type: "object",
    required: [
        "approved",
        "description",
        "descriptorUrl",
        "id",
        "imageUrl",
        "name",
        "owner",
        "stackContext",
        "totalWidgets"
    ],
    additionalProperties: true,
    properties: {
        approved: {
            type: "boolean"
        },
        description: {
            type: ["string", "null"]
        },
        descriptorUrl: {
            type: ["string", "null"]
        },
        id: {
            type: "number"
        },
        imageUrl: {
            type: ["string", "null"]
        },
        name: {
            type: "string"
        },
        owner: {
            $ref: "#/definitions/UserDashboard_User"
        },
        stackContext: {
            type: "string"
        },
        totalWidgets: {
            type: "number"
        }
    },
    definitions: {
        UserDashboard_User: USER_DASHBOARD_USER_SCHEMA
    }
};

export const USER_DASHBOARD_SCHEMA = {
    title: "UserDashboard",
    type: "object",
    required: [
        "alteredByAdmin",
        "dashboardPosition",
        "description",
        "guid",
        "iconImageUrl",
        "isGroupDashboard",
        "isdefault",
        "layoutConfig",
        "locked",
        "markedForDeletion",
        "name",
        "publishedToStore",
        "stack"
        // "type",
        // "user"
    ],
    additionalProperties: true,
    properties: {
        alteredByAdmin: {
            type: "boolean"
        },
        dashboardPosition: {
            type: "number"
        },
        description: {
            type: ["string", "null"]
        },
        guid: {
            type: "string"
        },
        iconImageUrl: {
            type: ["string", "null"]
        },
        isGroupDashboard: {
            type: "boolean"
        },
        isdefault: {
            type: "boolean"
        },
        layoutConfig: {
            type: "string"
        },
        locked: {
            type: "boolean"
        },
        markedForDeletion: {
            type: "boolean"
        },
        name: {
            type: "string"
        },
        publishedToStore: {
            type: "boolean"
        },
        stack: {
            $ef: "#/definitions/UserDashboard_Stack"
        }
        // type: {
        //     type: ["null"]
        // },
        // user: {
        //     $ref: "#/definitions/UserDashboard_User"
        // }
    },
    definitions: {
        UserDashboard_Stack: USER_DASHBOARD_STACK_SCHEMA,
        UserDashboard_User: USER_DASHBOARD_USER_SCHEMA
    }
};

export const USER_WIDGET_PROPERTIES_SCHEMA = {
    title: "UserWidgetProperties",
    type: "object",
    required: [
        "background",
        "definitionVisible",
        "description",
        "descriptorUrl",
        // "disabled",
        // "editable",
        // "favorite",
        // "groupWidget",
        "headerIcon",
        "height",
        "image",
        "intents",
        // "largeIconUrl",
        "maximized",
        "minimized",
        "mobileReady",
        "namespace",
        // "originalName",
        // "position",
        "singleton",
        "smallIconUrl",
        "universalName",
        "url",
        // "userId",
        // "userRealName",
        "visible",
        "widgetTypes",
        "widgetVersion",
        "width",
        "x",
        "y"
    ],
    additionalProperties: true,
    properties: {
        background: {
            type: ["boolean", "null"]
        },
        definitionVisible: {
            type: "boolean"
        },
        description: {
            type: ["string", "null"]
        },
        descriptorUrl: {
            type: ["string", "null"]
        },
        disabled: {
            type: "boolean"
        },
        editable: {
            type: "boolean"
        },
        favorite: {
            type: "boolean"
        },
        groupWidget: {
            type: "boolean"
        },
        headerIcon: {
            type: "string"
        },
        height: {
            type: "number"
        },
        image: {
            type: "string"
        },
        intents: {
            $ref: "#/definitions/Intents"
        },
        largeIconUrl: {
            type: "string"
        },
        maximized: {
            type: "boolean"
        },
        minimized: {
            type: "boolean"
        },
        mobileReady: {
            type: "boolean"
        },
        namespace: {
            type: "string"
        },
        originalName: {
            type: "string"
        },
        position: {
            type: "number"
        },
        singleton: {
            type: "boolean"
        },
        smallIconUrl: {
            type: "string"
        },
        universalName: {
            type: ["string"]
        },
        url: {
            type: "string"
        },
        userId: {
            type: "string"
        },
        userRealName: {
            type: "string"
        },
        visible: {
            type: "boolean"
        },
        widgetTypes: {
            type: "array",
            items: {
                $ref: "#/definitions/WidgetType"
            }
        },
        widgetVersion: {
            type: ["string", "null"]
        },
        width: {
            type: "number"
        },
        x: {
            type: "number"
        },
        y: {
            type: "number"
        }
    },
    definitions: {
        Intents: INTENTS_SCHEMA,
        ...INTENTS_SCHEMA.definitions,
        WidgetType: WIDGET_TYPE_SCHEMA
    }
};

export const USER_WIDGET_SCHEMA = {
    title: "UserWidget",
    type: "object",
    additionalProperties: true,
    required: ["id", "namespace", "path", "value"],
    properties: {
        id: {
            type: "number"
        },
        namespace: {
            type: "string"
        },
        path: {
            type: "string"
        },
        value: {
            $ref: "#/definitions/UserWidgetProperties"
        }
    },
    definitions: {
        UserWidgetProperties: USER_WIDGET_PROPERTIES_SCHEMA,
        ...USER_WIDGET_PROPERTIES_SCHEMA.definitions
    }
};

export const USER_DASHBOARDS_GET_RESPONSE_SCHEMA = {
    title: "UserDashboards Get Response",
    type: "object",
    required: ["dashboards", "widgets"],
    additionalProperties: true,
    properties: {
        dashboards: {
            type: "array",
            items: {
                $ref: "#/definitions/UserDashboard"
            }
        },
        widgets: {
            type: "array",
            items: {
                $ref: "#/definitions/UserWidget"
            }
        },
        user: {
            $ref: "#/definitions/UserDashboard_User"
        }
    },
    definitions: {
        UserDashboard: USER_DASHBOARD_SCHEMA,
        ...USER_DASHBOARD_SCHEMA.definitions,
        UserWidget: USER_WIDGET_SCHEMA,
        ...USER_WIDGET_SCHEMA.definitions
    }
};

import { INTENTS_SCHEMA } from "./intent.schema";
import { USER_SCHEMA } from "./user.schema";
import { GROUP_SCHEMA } from "./group.schema";

export const WIDGET_TYPE_SCHEMA = {
    title: "WidgetType",
    type: "object",
    required: ["displayName", "id", "name"],
    additionalProperties: false,
    properties: {
        displayName: {
            type: "string"
        },
        id: {
            type: "number"
        },
        name: {
            type: "string"
        }
    }
};

export const WIDGET_PROPERTIES_SCHEMA = {
    title: "WidgetProperties",
    type: "object",
    required: [
        "allRequired",
        "background",
        "definitionVisible",
        "description",
        "descriptorUrl",
        "directRequired",
        "headerIcon",
        "height",
        "image",
        "intents",
        "maximized",
        "mediumIconUrl",
        "minimized",
        "mobileReady",
        "namespace",
        "singleton",
        "smallIconUrl",
        "totalGroups",
        "totalUsers",
        "universalName",
        "url",
        "visible",
        "widgetTypes",
        "widgetVersion",
        "width",
        "x",
        "y"
    ],
    additionalProperties: false,
    properties: {
        allRequired: {
            type: "array"
        },
        background: {
            type: "boolean"
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
        directRequired: {
            type: "array"
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
        maximized: {
            type: "boolean"
        },
        mediumIconUrl: {
            type: "string"
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
        singleton: {
            type: "boolean"
        },
        smallIconUrl: {
            type: "string"
        },
        totalGroups: {
            type: "number"
        },
        totalUsers: {
            type: "number"
        },
        universalName: {
            type: ["string", "null"]
        },
        url: {
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
        WidgetType: WIDGET_TYPE_SCHEMA
    }
};

export const WIDGET_SCHEMA = {
    title: "Widget",
    type: "object",
    additionalProperties: false,
    required: ["id", "namespace", "path", "value"],
    properties: {
        id: {
            type: "string"
        },
        namespace: {
            type: "string"
        },
        path: {
            type: "string"
        },
        value: {
            $ref: "#/definitions/WidgetProperties"
        }
    },
    definitions: {
        Intents: INTENTS_SCHEMA,
        ...INTENTS_SCHEMA.definitions,
        WidgetProperties: WIDGET_PROPERTIES_SCHEMA,
        WidgetType: WIDGET_TYPE_SCHEMA
    }
};

export const WIDGET_GET_RESPONSE_SCHEMA = {
    title: "WidgetGetResponse",
    type: "object",
    required: ["data", "results", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Widget"
            }
        },
        results: {
            type: "number"
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Widget: WIDGET_SCHEMA,
        ...WIDGET_SCHEMA.definitions
    }
};

export const WIDGET_CREATE_RESPONSE_SCHEMA = {
    title: "WidgetCreateResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Widget"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Widget: WIDGET_SCHEMA,
        ...WIDGET_SCHEMA.definitions
    }
};

export const WIDGET_DELETE_RESPONSE_SCHEMA = {
    title: "WidgetDeleteResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                type: "object",
                require: ["id", "value"],
                additionalProperties: false,
                properties: {
                    id: {
                        type: "string"
                    },
                    value: {
                        type: "object"
                    }
                }
            }
        },
        success: {
            type: "boolean"
        }
    }
};

export const WIDGET_UPDATE_USERS_RESPONSE_SCHEMA = {
    title: "WidgetUpdateUsersResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/User"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        User: USER_SCHEMA
    }
};
export const WIDGET_UPDATE_GROUPS_RESPONSE_SCHEMA = {
    title: "WidgetUpdateGroupsResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Group"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Group: GROUP_SCHEMA
    }
};

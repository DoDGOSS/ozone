import { INTENTS_SCHEMA } from "./intent.schema";

export const WIDGET_TYPE_SCHEMA = {
    title: "WidgetType",
    type: "object",
    required: ["displayName", "id", "name"],
    additionalProperties: true,
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

export const WIDGET_TYPE_GET_RESPONSE_SCHEMA = {
    title: "WidgetGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/WidgetType"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        WidgetType: WIDGET_TYPE_SCHEMA
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
    additionalProperties: true,
    properties: {
        allRequired: {
            type: "array",
            items: {
                type: "string"
            }
        },
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
        directRequired: {
            type: "array",
            items: {
                type: "string"
            }
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
            type: ["string"]
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
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Widget"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        Widget: WIDGET_SCHEMA,
        ...WIDGET_SCHEMA.definitions
    }
};

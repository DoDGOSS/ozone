import { WIDGET_SCHEMA } from "./widget.schema";

export const GROUP_SCHEMA = {
    title: "Group",
    type: "object",
    required: [
        "status",
        "email",
        "description",
        "name",
        "automatic",
        "displayName",
        "stackDefault"
        // "people",
        // TODO -- missing in django
        // "totalStacks",
        // "totalUsers",
        // "totalWidgets"
    ],
    additionalProperties: true,
    properties: {
        automatic: {
            type: "boolean"
        },
        description: {
            type: ["string", "null"]
        },
        displayName: {
            type: ["string", "null"]
        },
        email: {
            type: ["string", "null"]
        },
        id: {
            type: "number"
        },
        version: {
            type: "number"
        },
        name: {
            type: "string"
        },
        stackDefault: {
            type: "boolean"
        },
        status: {
            type: "string",
            enum: ["active", "inactive"]
        },
        people: {
            type: "array"
        },
        totalUsers: {
            type: "number"
        },
        totalStacks: {
            type: "number"
        },
        totalWidgets: {
            type: "number"
        }
    }
};

export const GROUP_GET_RESPONSE_SCHEMA = {
    title: "GroupGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Group"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        Group: GROUP_SCHEMA
    }
};

export const GROUP_WIDGETS_GET_RESPONSE_SCHEMA = {
    title: "GroupWidgetsGetResponse",
    type: "object",
    required: ["group", "widgets"],
    additionalProperties: true,
    properties: {
        group: {
            type: "object",
            properties: {
                ...GROUP_SCHEMA.properties
            }
        },
        widgets: {
            type: "array",
            items: {
                $ref: "#/definitions/Widgets"
            }
        }
    },
    definitions: {
        Widgets: WIDGET_SCHEMA,
        ...WIDGET_SCHEMA.definitions
    }
};

export const WIDGET_GROUPS_GET_RESPONSE_SCHEMA = {
    title: "WidgetGroupsGetResponse",
    type: "object",
    required: ["widget", "groups"],
    additionalProperties: true,
    properties: {
        widget: {
            type: "object",
            properties: {
                ...WIDGET_SCHEMA.properties
            }
        },
        groups: {
            type: "array",
            items: {
                $ref: "#/definitions/Groups"
            }
        }
    },
    definitions: {
        Groups: GROUP_SCHEMA,
        Widgets: WIDGET_SCHEMA,
        ...WIDGET_SCHEMA.definitions
    }
};

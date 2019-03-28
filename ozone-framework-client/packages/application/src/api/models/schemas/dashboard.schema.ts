export const DASHBOARD_SCHEMA = {
    title: "Dashboard",
    type: "object",
    required: [
        "EDashboardLayoutList",
        "alteredByAdmin",
        "createdBy",
        "dashboardPosition",
        "description",
        "editedDate",
        "groups",
        "guid",
        "iconImageUrl",
        "isGroupDashboard",
        "isdefault",
        "layoutConfig",
        "locked",
        "markedForDeletion",
        "name",
        "prettyCreatedDate",
        "prettyEditedDate",
        "publishedToStore",
        "stack",
        "type",
        "user"
    ],
    additionalProperties: false,
    properties: {
        alteredByAdmin: {
            type: "string"
        },
        createdBy: {
            type: "object",
            required: ["userId", "userRealName"],
            additionalProperties: false,
            properties: {
                userId: {
                    type: ["string", "null"]
                },
                userRealName: {
                    type: ["string", "null"]
                }
            }
        },
        createdDate: {
            type: "string"
        },
        dashboardPosition: {
            type: "number"
        },
        description: {
            type: ["string", "null"]
        },
        editedDate: {
            type: "string"
        },
        EDashboardLayoutList: {
            type: "string"
        },
        groups: {
            type: "array" // TODO
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
        prettyCreatedDate: {
            type: "string"
        },
        prettyEditedDate: {
            type: "string"
        },
        publishedToStore: {
            type: "boolean"
        },
        stack: {
            type: ["null"] // TODO
        },
        type: {
            type: ["null"] // TODO
        },
        user: {
            type: "object",
            required: ["userId"],
            additionalProperties: false,
            properties: {
                userId: {
                    type: "string"
                }
            }
        }
    }
};

export const DASHBOARD_GET_RESPONSE_SCHEMA = {
    title: "DashboardGetResponse",
    type: "object",
    required: ["data", "results", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Dashboard"
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
        Dashboard: DASHBOARD_SCHEMA
    }
};

export const DASHBOARD_UPDATE_RESPONSE_SCHEMA = {
    title: "DashboardUpdateResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Dashboard"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Dashboard: DASHBOARD_SCHEMA
    }
};

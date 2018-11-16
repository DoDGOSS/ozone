import { JsonSchema } from "../schemas";
import { WidgetDTO, WidgetPropsDTO } from "./widget.dto";

export const WIDGET_SCHEMA_REF = "#/components/schemas/Widget";


export const WIDGET_PROPS_SCHEMA: JsonSchema<WidgetPropsDTO> = {
    type: "object",
    required: [
        "universalName",
        "namespace",
        "description",
        "url",
        "headerIcon",
        "image",
        "smallIconUrl",
        "mediumIconUrl",
        "width",
        "height",
        "x",
        "y",
        "minimized",
        "maximized",
        "widgetVersion",
        "totalUsers",
        "totalGroups",
        "singleton",
        "visible",
        "background",
        "mobileReady",
        "descriptorUrl",
        "definitionVisible",
        "directRequired",
        "allRequired",
        "intents",
        "widgetTypes"
    ],
    additionalProperties: false,
    properties: {
        universalName: {
            type: "string"
        },
        namespace: {
            type: "string"
        },
        description: {
            type: "string"
        },
        headerIcon: {
            type: "string"
        },
        image: {
            type: "string"
        },
        smallIconUrl: {
            type: "string"
        },
        mediumIconUrl: {
            type: "string"
        },
        width: {
            type: "number"
        }
    }
};

export const WIDGET_SCHEMA: JsonSchema<WidgetDTO> = {
    type: "object",
    required: [
        "id",
        "namespace",
        "path",
        "value"
    ],
    additionalProperties: false,
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
        value: WIDGET_PROPS_SCHEMA
    }
};

import { assign, cloneDeep, isUndefined } from "lodash";
import { withoutNil } from "./util";

export class JsonSchemaBuilder {

    type: string;
    required?: string[];
    additionalProperties?: boolean;
    properties?: { [name: string]: any };

    definitions?: { [name: string]: any };

    items?: any;

    constructor(type: string) {
        this.type = type;
    }

    addRequired(propertyName: string): void {
        if (isUndefined(this.required)) this.required = [];

        this.required.push(propertyName);
    }

    addProperty(propertyName: string, propertyValue: any): void {
        if (isUndefined(this.properties)) this.properties = {};

        this.properties[propertyName] = propertyValue;
    }

    addSchema(schemaName: string, schemaValue: any): void {
        if (isUndefined(this.definitions)) this.definitions = {};

        if (schemaName in this.definitions) return;

        const schema = cloneDeep(schemaValue);

        if (schema.definitions) {
            assign(this.definitions, schema.definitions);
            delete schema.definitions;
        }

        this.definitions[schemaName] = schema;
    }

    toJSON(): any {
        return withoutNil({
            type: this.type,
            required: this.required,
            additionalProperties: this.additionalProperties,
            properties: this.properties,
            items: this.items,
            definitions: this.definitions
        });
    }

}



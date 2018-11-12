import { isUndefined, withoutNil } from "./util";


export class JsonSchema {

    type: string;
    required?: string[];
    additionalProperties?: boolean;
    properties?: { [name: string]: any };

    components?: {
        schemas?: { [name: string]: any };
    };

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
        if (isUndefined(this.components)) this.components = {};
        if (isUndefined(this.components.schemas)) this.components.schemas = {};

        this.components.schemas[schemaName] = schemaValue;
    }

    toJSON(): any {
        return withoutNil({
            type: this.type,
            required: this.required,
            additionalProperties: this.additionalProperties,
            properties: this.properties,
            components: this.components
        });
    }

}



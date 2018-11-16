import { PropertyOptions, ResponseOptions, SchemaOptions } from "./interfaces";

import { PropertyMetadata, ResponseMetadata, SchemaMetadata } from "./metadata";

import {
    ComponentType,
    getComponentProperties,
    getComponentType,
    getDesignTypeName,
    hasComponentProperties,
    setComponentMetadata,
    setComponentProperties,
    setComponentType
} from "./reflect";

import { isUndefined, valuesOf } from "./util";


let componentContainer: ComponentContainer;

export function getDefaultComponentContainer(): ComponentContainer {
    if (!componentContainer) {
        componentContainer = new ComponentContainer();
    }
    return componentContainer;
}


export class ComponentContainer {

    private schemas: { [id: string]: SchemaMetadata } = {};
    private responses: { [id: string]: ResponseMetadata } = {};

    getSchema(schema: Function): SchemaMetadata {
        const metadata = this.schemas[schema.name];

        if (isUndefined(metadata)) {
            throw new Error(`Schema component '${schema.name}' has not declared.`);
        }

        return metadata;
    }

    getSchemas(): SchemaMetadata[] {
        return valuesOf(this.schemas);
    }

    getResponse(response: Function): ResponseMetadata {
        const metadata = this.responses[response.name];

        if (isUndefined(metadata)) {
            throw new Error(`Response component '${response.name}' has not declared.`);
        }

        return metadata;
    }

    getResponses(): ResponseMetadata[] {
        return valuesOf(this.responses);
    }

    addSchemaMetadata(schema: Function, options?: SchemaOptions): void {
        const schemaName = schema.name;

        const existingComponentType = getComponentType(schema);
        if (existingComponentType) {
            throw new Error(`Failed to declare Schema component '${schemaName}'; already has type '${existingComponentType}'`);
        }

        if (schemaName in this.schemas) {
            throw new Error(`Schema component already exists with name '${schemaName}'`);
        }

        setComponentType(schema, ComponentType.SCHEMA);

        const properties = getComponentProperties(schema);
        const schemaMetadata = new SchemaMetadata(schema, properties, options);
        this.schemas[schemaName] = schemaMetadata;
        setComponentMetadata(schema, schemaMetadata);
    }

    addResponseMetadata(response: Function, options: ResponseOptions) {
        const responseName = response.name;

        const existingComponentType = getComponentType(response);
        if (existingComponentType) {
            throw new Error(`Failed to declare Response component '${responseName}'; already has type '${existingComponentType}'`);
        }

        if (responseName in this.responses) {
            throw new Error(`Response component already exists with name '${responseName}'`);
        }

        setComponentType(response, ComponentType.RESPONSE);

        const properties = getComponentProperties(response);
        const responseMetadata = new ResponseMetadata(response, properties, options);
        this.responses[responseName] = responseMetadata;
        setComponentMetadata(response, responseMetadata);
    }

    addPropertyMetadata(component: object, key: string | symbol, type?: () => Function, propertySchema?: PropertyOptions) {
        const propertyKey = String(key);
        const primitiveType = getDesignTypeName(component, propertyKey);
        if (isUndefined(primitiveType)) {
            throw new Error("Failed to add Property metadata: unknown primitive type");
        }

        const propertyMetadata = new PropertyMetadata(propertyKey, primitiveType, type, propertySchema);

        if (hasComponentProperties(component.constructor)) {
            const properties = getComponentProperties(component.constructor);
            properties[propertyKey] = propertyMetadata;
        } else {
            const properties = { [propertyKey]: propertyMetadata };
            setComponentProperties(component.constructor, properties);
        }
    }

}




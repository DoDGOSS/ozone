import { ModelOptions, PropertyOptions } from "./interfaces";
import { ModelMetadata, PropertyMetadata } from "./metadata";

import {
    deleteModelMetadata,
    deleteModelProperties,
    getDesignType, getModelMetadata,
    getModelProperties,
    hasModelProperties,
    setModelMetadata,
    setModelProperties
} from "./reflect";

import { forIn, values } from "lodash";


let componentContainer: ComponentContainer;

export function getDefaultComponentContainer(): ComponentContainer {
    if (componentContainer === undefined) {
        componentContainer = new ComponentContainer();
    }

    return componentContainer;
}

export function resetDefaultComponentContainer() {
    if (componentContainer !== undefined) {
        componentContainer.clear();
    }

    componentContainer = new ComponentContainer();
}

export class ComponentContainer {

    private _metadata: { [id: string]: ModelMetadata } = {};

    clear(): void {
        forIn(this._metadata, (metadata: ModelMetadata) => {
            const target = metadata.target;
            deleteModelProperties(target);
            deleteModelMetadata(target);
        });
    }

    getAllModelMetadata(): ModelMetadata[] {
        return values(this._metadata);
    }

    getModelMetadata(model: Function): ModelMetadata {
        const metadata = getModelMetadata(model);
        if (!metadata) {
            throw new Error(`Model '${model.name}' not found`);
        }

        const options = metadata.options;
        const modelName = (options && options.name) ? options.name : model.name;

        if (!(modelName in this._metadata)) {
            throw new Error(`Model '${modelName}' not found`);
        }

        return this._metadata[modelName];
    }

    addModelMetadata(model: Function, options?: ModelOptions): void {
        const modelName = (options && options.name) ? options.name : model.name;

        if (modelName in this._metadata) {
            throw new Error(`Model already exists with name '${modelName}'`);
        }

        const properties = getModelProperties(model);
        const modelMetadata = new ModelMetadata(model, properties, options);
        setModelMetadata(model, modelMetadata);
        this._metadata[modelName] = modelMetadata;
    }

    addPropertyMetadata(component: object, key: string | symbol, type?: () => Function, propertySchema?: PropertyOptions) {
        const propertyKey = String(key);

        const primitiveType = getDesignType(component, propertyKey);
        const propertyMetadata = new PropertyMetadata(propertyKey, primitiveType, type, propertySchema);

        if (hasModelProperties(component.constructor)) {
            const properties = getModelProperties(component.constructor);
            properties[propertyKey] = propertyMetadata;
        } else {
            const properties = { [propertyKey]: propertyMetadata };
            setModelProperties(component.constructor, properties);
        }
    }

}




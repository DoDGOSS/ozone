import { PropertyOptions, ResponseOptions, SchemaOptions } from "./interfaces";

import { getDefaultComponentContainer } from "./container";
import { isFunction } from "./util";


export function Schema(options?: SchemaOptions): ClassDecorator {
    return (target: Function) => {
        getDefaultComponentContainer().addSchemaMetadata(target, options);
    };
}


export function Response(options: ResponseOptions): ClassDecorator {
    return (target: Function) => {
        getDefaultComponentContainer().addResponseMetadata(target, options);
    };
}


export function Property(options?: PropertyOptions): PropertyDecorator;
export function Property(type: () => Function, options?: PropertyOptions): PropertyDecorator;
export function Property(arg1?: any, arg2?: any): PropertyDecorator {
    return (component: object, key: string | symbol) => {
        let typeProvider: (() => Function) | undefined;
        let options: PropertyOptions | undefined;

        if (isFunction(arg1)) {
            typeProvider = arg1;
            options = arg2;
        } else {
            options = arg1;
        }

        getDefaultComponentContainer().addPropertyMetadata(component, key, typeProvider, options);
    };
}

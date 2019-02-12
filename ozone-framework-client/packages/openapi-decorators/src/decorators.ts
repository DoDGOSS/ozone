import { ModelOptions, PropertyOptions } from "./interfaces";

import { getDefaultComponentContainer } from "./container";
import { isFunction } from "lodash";


export function Model(options?: ModelOptions): ClassDecorator {
    return (target: Function) => {
        getDefaultComponentContainer().addModelMetadata(target, options);
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

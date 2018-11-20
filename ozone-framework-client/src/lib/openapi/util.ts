import { None, Option } from "space-lift";
import { isNil, isObject } from "lodash";
import { isArrayLike } from "mobx";

export function invoke<T>(fn: (() => T) | null | undefined): Option<T> {
    return isNil(fn) ? None : Option(fn());
}

export function withoutNil(object: object): object {
    const result = {};
    for (const key of Object.keys(object)) {
        const value = object[key];
        if (!isNil(value)) {
            if (isObject(value) && !isArrayLike(value)) {
                result[key] = withoutNil(value);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

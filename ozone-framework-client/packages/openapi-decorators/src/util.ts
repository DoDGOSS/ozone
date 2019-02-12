import { None, Option } from "space-lift";
import { isArrayLike, isNil, isObject } from "lodash";

export function invoke<T>(fn: (() => T) | null | undefined): Option<T> {
    return isNil(fn) ? None : Option(fn());
}

export function withoutNil(object: {[key: string]: any}): object {
    const result: {[key: string]: any} = {};
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

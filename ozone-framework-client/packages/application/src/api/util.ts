import { isArray, isUndefined } from "lodash";


export function toArray<T>(value: T | T[]): T[] {
    if (isUndefined(value)) return [];
    if (isArray(value)) return value;

    return [value];
}

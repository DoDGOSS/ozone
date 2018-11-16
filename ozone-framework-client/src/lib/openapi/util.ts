export function valuesOf<T>(dict: { [key: string]: T }): T[] {
    const values: T[] = [];
    for (const key in dict) {
        if (dict.hasOwnProperty(key)) {
            values.push(dict[key]);
        }
    }
    return values;
}

export function isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isNil(value: any): value is null | undefined {
    return isNull(value) || isUndefined(value);
}

export function isFunction(value: any): value is Function {
    return typeof value === "function";
}

export function isObject(value: unknown): value is object {
    return !isNull(value) && typeof value === "object" && !Array.isArray(value);
}

export function setIfAbsent<T>(map: {[id: string]: T}, key: string, value: T): void {
    if (key in map) return;

    map[key] = value;
}

export function withoutNil(object: object): object {
    const result = {};
    for (const key of Object.keys(object)) {
        const value = object[key];
        if (!isNil(value)) {
            if (isObject(value)) {
                result[key] = withoutNil(value);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

import { isArray } from "lodash";
import { default as _uuid } from "uuid/v4";

export * from "./collections";
export * from "./predicates";
export * from "./react";
export * from "./selectors";

export function uuid(): string {
    return _uuid();
}

export type TypeGuard<T> = (value: unknown) => value is T;

export function lazy<T>(factory: () => T): () => T {
    let instance: T | undefined;
    return () => {
        if (!instance) {
            instance = factory();
        }
        return instance;
    };
}

export function isBlank(value: string): boolean {
    return value.trim().length === 0;
}

export function toArray<T>(value: T | T[] | undefined): T[] {
    if (isUndefined(value)) return [];
    if (isArray(value)) return value;

    return [value];
}

export function isNil(value: unknown): value is undefined | null {
    return value === null || value === undefined || value === "null";
}

function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

export function isString(value: unknown): value is string {
    return !isNil(value) && typeof value === "string";
}

isString.toString = () => "string";

export function isStringArray(value: unknown): value is string[] {
    return expectEach(value, isString);
}

isStringArray.toString = () => "string[]";

function expectEach<V>(value: unknown, guard: TypeGuard<V>): value is V[] {
    if (isNil(value) || !isArray(value)) return false;

    for (const v in value) {
        if (value.hasOwnProperty(v) && !guard(v)) return false;
    }

    return true;
}

export function getIn<T, K extends keyof T, V>(object: T, key: K, guard: TypeGuard<V>): V | undefined {
    if (isNil(object)) return undefined;

    const value = object[key];
    if (isUndefined(value)) return undefined;

    return guard(value) ? value : undefined;
}

export function omitIndex<T>(array: T[], index: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
        if (i !== index) {
            result.push(array[i]);
        }
    }
    return result;
}

/**
 * Returns the value, or undefined if value is null or undefined.
 */
export function optional<T extends any>(value: T | null | undefined): T | undefined {
    return isNil(value) ? undefined : value;
}

/**
 * Returns the value, or null if value is null or undefined.
 */
export function orNull<T extends any>(value: T | null | undefined): T | null {
    return isNil(value) ? null : value;
}

export function flatMap<T, R>(collection: Collection<T>, iteratee: Iteratee<T, R | R[]>): R[] {
    const array = isArray(collection) ? collection : Object.values(collection);

    const results: R[] = [];
    for (const value of array) {
        const mapped = iteratee(value);
        if (isArray(mapped)) {
            results.push(...mapped);
        } else {
            results.push(mapped);
        }
    }
    return results;
}

export function isFunction(f: any) {
    return f !== null && f !== undefined && typeof f === "function";
}

export function cleanNullableProp<T>(value: T | null): T | string {
    if (value === null) {
        return "";
    } else {
        return value;
    }
}

export function swapIndices<T>(array: T[], idx1: number, idx2: number): T[] {
    const arrayCopy = [...array];
    const temp = arrayCopy[idx1];
    arrayCopy[idx1] = arrayCopy[idx2];
    arrayCopy[idx2] = temp;
    return arrayCopy;
}

export function asInteger(value: unknown, defaultValue: number = 0): number {
    if (typeof value === "number") {
        return parseInt(value.toFixed(0), 10);
    }

    if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        return !isNaN(parsed) ? parsed : defaultValue;
    }

    return defaultValue;
}

export function clampMinimum(num: number, minimum: number): number {
    return num >= minimum ? num : minimum;
}

export interface Boxed<T> {
    value: T | undefined;
}

export function boxed<T>(value?: T): Boxed<T> {
    return { value };
}

export function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let cookie of ca) {
        cookie = cookie.trim();
        const cookieKey = cookie.substring(0, cookie.indexOf("=")).trim();
        const cookieValue = cookie.substring(cookieKey.length + 1, cookie.length).trim();
        if (cookieKey === cname) return cookieValue;
    }
    return "";
}

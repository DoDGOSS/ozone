import * as React from "react";

import { isArray, values as _values } from "lodash";

import { default as _classNames } from "classnames";

import { default as _uuid } from "uuid/v4";

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
    return value === null || value === undefined;
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

export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

export function handleSelectChange(handler: (value: string) => void) {
    return (event: React.FormEvent<Element>) => handler((event.target as HTMLSelectElement).value);
}

export function classNames(...classes: ClassValue[]): string {
    return _classNames(classes);
}

export interface ClassArray extends Array<ClassValue> {}

export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

export interface ClassDictionary {
    [id: string]: any;
}

export type Predicate<T> = (value: T) => boolean;

export function not<T>(predicate: Predicate<T>): Predicate<T> {
    return (value: T) => !predicate(value);
}

/**
 * Checks if predicate returns truthy for any element of collection.
 * Iteration is stopped once predicate returns truthy.
 */
export function some<T>(collection: T[], predicate: Predicate<T>): boolean {
    for (const item of collection) {
        if (predicate(item)) return true;
    }
    return false;
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

/**
 * Creates an array of the own enumerable property values of object.
 */
export function values<T>(obj: Dictionary<T> | NumericDictionary<T>): T[] {
    return _values(obj);
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

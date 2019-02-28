import * as React from "react";

import { isArray } from "lodash";

import { default as _classNames } from "classnames";

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

export function toArray<T>(value: T | T[]): T[] {
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

export function classNames(...classes: ClassValue[]): string {
    return _classNames(classes);
}

interface ClassArray extends Array<ClassValue> {
}

type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

interface ClassDictionary {
    [id: string]: any;
}

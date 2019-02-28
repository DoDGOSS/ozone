import * as React from "react";

import { isArray, isUndefined } from "lodash";

import { default as _classNames } from "classnames";


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

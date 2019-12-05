import * as React from "react";
import { default as _classNames } from "classnames";
import { parseInt10 } from "./collections";

export interface ClassArray extends Array<ClassValue> {}

export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

export interface ClassDictionary {
    [id: string]: any;
}

export function classNames(...classes: ClassValue[]): string {
    return _classNames(classes);
}

export function handleSelectChange(handler: (value: number) => void) {
    return (event: React.FormEvent<Element>) => handler(parseInt10((event.target as HTMLSelectElement).value));
}

export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

export function handleBooleanChange(handler: (value: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

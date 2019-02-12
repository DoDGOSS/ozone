import * as React from "react";

import { default as _classNames } from "classnames";


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

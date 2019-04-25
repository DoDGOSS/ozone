import * as React from "react";

export function isNil(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

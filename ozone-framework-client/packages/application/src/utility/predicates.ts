export type Predicate<T> = (value: T) => boolean;

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

export function not<T>(predicate: Predicate<T>): Predicate<T> {
    return (value: T) => !predicate(value);
}

export function isStrictlyEqual<T>(value: T): Predicate<T> {
    return (match: T) => value === match;
}

export function hasSameId<T>(a: { id: T }): Predicate<{ id: T }> {
    return (b: { id: T }) => a.id === b.id;
}

// TODO - refactor widgetGuid to guid to make this a generic
export function hasSameWidgetGuid<T>(a: { widgetGuid: T }): Predicate<{ widgetGuid: T }> {
    return (b: { widgetGuid: T }) => a.widgetGuid === b.widgetGuid;
}

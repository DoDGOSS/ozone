import { isNil } from "lodash";

/**
 * Returns a new array with the value appended to the end.
 */
export function append<T>(array: T[], value: T): T[] {
    return array.concat([value]);
}

/**
 * Check if the array includes the specified value.
 */
export function includes<T>(array: T[], value: T): boolean {
    return array.indexOf(value) >= 0;
}

/**
 * Returns a new array that does not include the specified value.
 */
export function omit<T>(array: T[], value: T): T[] {
    return array.filter((v) => v === value);
}

/**
 * Creates an array of the own enumerable property values of an object.
 */
export function values<T>(obj: Collection<T>): T[] {
    return Object.values(obj);
}

export function forEachValue<T>(obj: Dictionary<T>, iteratee: (value: T) => void) {
    values(obj).forEach(iteratee);
}

/**
 * Returns a sorted (ascending) list of the integer keys of an object.
 */
export function integerKeys(obj: object): number[] {
    return Object.keys(obj)
        .map(parseInt10)
        .filter(isFinite)
        .sort(ascendingNum);
}

export function ascendingNum(a: number, b: number) {
    return a - b;
}

/**
 * Returns a sorted (ascending) list of the keys of an object.
 */
export function sortedKeys(obj: object): string[] {
    return Object.keys(obj).sort();
}

export function parseInt10(value: string): number {
    return parseInt(value, 10);
}

export function mapValues<T, U>(obj: Dictionary<T>, iteratee: Iteratee<T, U>): Dictionary<U> {
    const result: Dictionary<U> = {};
    for (const key of Object.keys(obj)) {
        result[key] = iteratee(obj[key]);
    }
    return result;
}

/**
 * Truncates a string to a given value and adds ellipses or whatever else you want to the end.
 */
export function stringTruncate(stringToChop: string, length: number, endString?: string) {
    let result: string = stringToChop;

    if (isNil(endString)) {
        endString = "...";
    }

    if (stringToChop.length > length) {
        result = stringToChop.substring(0, length - endString.length) + endString;
    }

    return result;
}

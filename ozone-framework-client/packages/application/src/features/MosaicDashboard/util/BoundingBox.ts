import { MosaicDirection } from "../types";
import { assertNever } from "./assertNever";

// Each of these values is like the CSS property of the same name in percentages
export interface BoundingBox {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface BoundingBoxSplit {
    first: BoundingBox;
    second: BoundingBox;
}

export interface BoundingBoxStyle {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

export function empty(): BoundingBox {
    return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
}

export function split(
    boundingBox: BoundingBox,
    relativeSplitPercentage: number,
    direction: MosaicDirection
): BoundingBoxSplit {
    const absolutePercentage = getAbsoluteSplitPercentage(boundingBox, relativeSplitPercentage, direction);
    if (direction === "column") {
        return {
            first: {
                ...boundingBox,
                bottom: 100 - absolutePercentage
            },
            second: {
                ...boundingBox,
                top: absolutePercentage
            }
        };
    } else if (direction === "row") {
        return {
            first: {
                ...boundingBox,
                right: 100 - absolutePercentage
            },
            second: {
                ...boundingBox,
                left: absolutePercentage
            }
        };
    } else {
        return assertNever(direction);
    }
}

export function getAbsoluteSplitPercentage(
    boundingBox: BoundingBox,
    relativeSplitPercentage: number,
    direction: MosaicDirection
): number {
    const { top, right, bottom, left } = boundingBox;
    if (direction === "column") {
        const height = 100 - top - bottom;
        return (height * relativeSplitPercentage) / 100 + top;
    } else if (direction === "row") {
        const width = 100 - right - left;
        return (width * relativeSplitPercentage) / 100 + left;
    } else {
        return assertNever(direction);
    }
}

export function getRelativeSplitPercentage(
    boundingBox: BoundingBox,
    absoluteSplitPercentage: number,
    direction: MosaicDirection
): number {
    const { top, right, bottom, left } = boundingBox;
    if (direction === "column") {
        const height = 100 - top - bottom;
        return ((absoluteSplitPercentage - top) / height) * 100;
    } else if (direction === "row") {
        const width = 100 - right - left;
        return ((absoluteSplitPercentage - left) / width) * 100;
    } else {
        return assertNever(direction);
    }
}

export function asStyles({ top, right, bottom, left }: BoundingBox): BoundingBoxStyle {
    return {
        top: `${top}%`,
        right: `${right}%`,
        bottom: `${bottom}%`,
        left: `${left}%`
    };
}

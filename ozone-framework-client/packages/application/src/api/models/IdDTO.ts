import { toArray } from "../../utility";

export interface IdDTO {
    id: number;
}

export function mapIds(id: number | number[]): IdDTO[] {
    return toArray(id).map((i) => ({ id: i }));
}

export interface UuidDTO {
    id: string;
}

export function mapUuids(id: string | string[]): UuidDTO[] {
    return toArray(id).map((i) => ({ id: i }));
}

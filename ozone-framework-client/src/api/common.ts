import * as _ from "lodash";

import { Property, Schema } from "../lib/openapi/decorators";


export function toArray<T>(value: T | T[]): T[] {
    if (_.isUndefined(value)) return [];
    if (_.isArray(value)) return value;

    return [value];
}

export function toIdArray(id: number | number[]): Array<{ id: number }> {
    return toArray(id).map((i) => ({ id: i }));
}

@Schema()
export class Id {

    @Property()
    id: number;

}

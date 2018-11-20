import { Model, Property } from "../../lib/openapi/decorators";

import { toArray } from "../common";


@Model({name: "Id"})
export class IdDto {

    static fromValues(id: number | number[]): IdDto[] {
        return toArray(id).map((i) => new IdDto(i));
    }

    @Property()
    id: number;

    constructor(id: number) {
        this.id = id;
    }

    toJSON(): any {
        return {id: this.id};
    }

}

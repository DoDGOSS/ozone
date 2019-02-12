import { Model, Property } from "@ozone/openapi-decorators";

import { toArray } from "../util";


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


@Model({name: "Uuid"})
export class UuidDto {

    static fromValues(id: string | string[]): UuidDto[] {
        return toArray(id).map((i) => new UuidDto(i));
    }

    @Property()
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    toJSON(): any {
        return {id: this.id};
    }

}

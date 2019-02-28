import { Model, Property } from "@ozone/openapi-decorators";

import { toArray } from "../../utility";

@Model({ name: "Id" })
export class IdDTO {
    static fromValues(id: number | number[]): IdDTO[] {
        return toArray(id).map((i) => new IdDTO(i));
    }

    @Property()
    id: number;

    constructor(id: number) {
        this.id = id;
    }

    toJSON(): any {
        return { id: this.id };
    }
}

@Model({ name: "Uuid" })
export class UuidDTO {
    static fromValues(id: string | string[]): UuidDTO[] {
        return toArray(id).map((i) => new UuidDTO(i));
    }

    @Property()
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    toJSON(): any {
        return { id: this.id };
    }
}

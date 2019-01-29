import { Model, Property } from "../../lib/openapi/decorators";


@Model({ name: "WidgetType" })
export class WidgetTypeDTO {

    @Property()
    id: number;

    @Property()
    name: string;

    @Property()
    displayName: string;

}


@Model()
export class WidgetTypeReference {

    @Property()
    id: number;

    @Property()
    name: string;

}

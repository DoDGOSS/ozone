import { Model, Property } from "@ozone/openapi-decorators";

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

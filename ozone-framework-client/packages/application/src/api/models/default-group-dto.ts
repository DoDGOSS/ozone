import { createValidator, Model, Property } from "@ozone/openapi-decorators";

@Model({ name: "DefaultGroup" })
export class DefaultGroupDTO {
    static validate = createValidator(DefaultGroupDTO);

    @Property()
    id: number;

    @Property()
    name: string;

    @Property({ nullable: true })
    displayName: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ nullable: true })
    email?: string;

    @Property({ enum: ["active", "inactive"] })
    status: "active" | "inactive";

    @Property()
    automatic: boolean;

    @Property({ readOnly: true })
    stackDefault: boolean;

    @Property({ readOnly: true })
    totalStacks: number;

    @Property({ readOnly: true })
    totalUsers: number;

    @Property({ readOnly: true })
    totalWidgets: number;
}

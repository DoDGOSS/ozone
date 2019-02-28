import { createValidator, Model, Property } from "@ozone/openapi-decorators";

@Model({ name: "AuthUser" })
export class AuthUserDTO {
    static validate = createValidator(AuthUserDTO);

    @Property()
    id: number;

    @Property()
    username: string;

    @Property()
    userRealName: string;

    @Property({ nullable: true })
    email?: string;

    @Property()
    isAdmin: boolean;

    @Property(() => String)
    roles: string[];

    @Property(() => AuthGroupDTO)
    groups: AuthGroupDTO[];
}

@Model({ name: "AuthGroup" })
export class AuthGroupDTO {
    static validate = createValidator(AuthGroupDTO);

    @Property()
    id: number;

    @Property()
    name: string;

    @Property()
    displayName: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ nullable: true })
    email?: string;

    @Property({ enum: ["active", "inactive"] })
    status: "active" | "inactive";

    @Property()
    automatic: boolean;
}

import { createValidator, Model, Property } from "@ozone/openapi-decorators";

import { IdDTO } from "./IdDTO";

@Model({ name: "Group" })
export class GroupDTO {
    static validate = createValidator(GroupDTO);

    @Property()
    id: number;

    @Property()
    name: string;

    @Property({ nullable: true })
    displayName?: string;

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

@Model()
export class GroupGetResponse {
    static validate = createValidator(GroupGetResponse);

    @Property()
    results: number;

    @Property(() => GroupDTO)
    data: GroupDTO[];
}

export interface GroupCreateRequest {
    name: string;
    displayName?: string;
    description?: string;
    email?: string;
    automatic?: boolean;
    status?: "active" | "inactive";
    active?: boolean;
}

@Model()
export class GroupCreateResponse {
    static validate = createValidator(GroupCreateResponse);

    @Property()
    success: boolean;

    @Property(() => GroupDTO)
    data: GroupDTO[];
}

export interface GroupUpdateRequest extends GroupCreateRequest {
    id: number;
    update_action?: "add" | "remove";
    user_ids?: Array<number>;
}

@Model()
export class GroupUpdateResponse {
    static validate = createValidator(GroupUpdateResponse);

    @Property()
    success: boolean;

    @Property(() => GroupDTO)
    data: GroupDTO[];
}

@Model()
export class GroupDeleteResponse {
    static validate = createValidator(GroupDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => IdDTO)
    data: IdDTO[];
}

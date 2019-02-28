import { createValidator, Model, Property } from "@ozone/openapi-decorators";

import { GroupDTO } from "./GroupDTO";
import { UserDTO, UsernameDTO } from "./UserDTO";

@Model({ name: "Stack" })
export class StackDTO {
    static validate = createValidator(StackDTO);

    @Property()
    approved: boolean;

    @Property({ nullable: true })
    imageUrl?: string;

    @Property()
    id: number;

    @Property({ nullable: true })
    owner?: UsernameDTO;

    @Property()
    groups: any[];

    @Property()
    stackContext: string;

    @Property()
    defaultGroup: GroupDTO;

    @Property({ nullable: true })
    descriptorUrl?: string;

    @Property({ nullable: true })
    description?: string;

    @Property()
    name: string;

    @Property({ readOnly: true })
    totalWidgets: number;

    @Property({ readOnly: true })
    totalGroups: number;

    @Property({ readOnly: true })
    totalUsers: number;

    @Property({ readOnly: true })
    totalDashboards: number;
}

@Model()
export class StackGetResponse {
    static validate = createValidator(StackGetResponse);

    @Property()
    results: number;

    @Property(() => StackDTO)
    data: StackDTO[];
}

export interface StackUpdateParams {
    adminEnabled?: boolean;
}

export interface StackCreateRequest {
    name: string;
    approved?: boolean;
    imageUrl?: string;
    stackContext: string;
    descriptorUrl?: string;
    description?: string;
}

export interface StackUpdateRequest extends StackCreateRequest {
    id: number;
    update_action?: "add" | "remove";
    tab?: "users" | "groups";
    data?: UserDTO[] | GroupDTO[];
}

@Model()
export class StackUpdateResponse {
    static validate = createValidator(StackUpdateResponse);

    @Property()
    success: boolean;

    @Property(() => StackDTO)
    data: StackDTO[];
}

@Model()
export class StackDeleteIdDTO {
    @Property()
    id: number;
}

@Model()
export class StackDeleteResponse {
    static validate = createValidator(StackDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => StackDeleteIdDTO)
    data: StackDeleteIdDTO[];
}

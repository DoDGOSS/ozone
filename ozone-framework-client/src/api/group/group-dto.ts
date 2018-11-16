import { Property, Response, Schema } from "../../lib/openapi/decorators";
import { createLazyComponentValidator } from "../schemas";
import { Id } from "../common";


@Schema({ name: "Group" })
export class GroupDTO {

    static validate = createLazyComponentValidator(GroupDTO);

    @Property()
    id: number;

    @Property()
    name: string;

    @Property()
    displayName: string;

    @Property({nullable: true})
    description?: string;

    @Property({nullable: true})
    email?: string;

    @Property({enum: ["active", "inactive"]})
    status: "active" | "inactive";

    @Property()
    automatic: boolean;

    @Property({readOnly: true})
    stackDefault: boolean;

    @Property({readOnly: true})
    totalStacks: number;

    @Property({readOnly: true})
    totalUsers: number;

    @Property({readOnly: true})
    totalWidgets: number;

}


@Response({description: "Success"})
export class GroupGetResponse {

    static validate = createLazyComponentValidator(GroupGetResponse);

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
}


@Response({description: "Success"})
export class GroupCreateResponse {

    static validate = createLazyComponentValidator(GroupCreateResponse);

    @Property()
    success: boolean;

    @Property(() => GroupDTO)
    data: GroupDTO[];

}

export interface GroupUpdateRequest {
    id: number;
    name: string;
    displayName?: string;
    description?: string;
    email?: string;
    automatic: boolean;
    status: "active" | "inactive";
}


@Response({description: "Success"})
export class GroupUpdateResponse {

    static validate = createLazyComponentValidator(GroupUpdateResponse);

    @Property()
    success: boolean;

    @Property(() => GroupDTO)
    data: GroupDTO[];

}


@Response({description: "Success"})
export class GroupDeleteResponse {

    static validate = createLazyComponentValidator(GroupDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => Id)
    data: Id[];

}

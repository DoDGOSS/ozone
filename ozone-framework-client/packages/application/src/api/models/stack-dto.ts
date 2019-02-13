import { createValidator, Model, Property } from "@ozone/openapi-decorators";
import { GroupDTO } from "./group-dto";
import { IdDto } from "./id-dto";

@Model({ name: "Stack" })
export class StackDTO {

    static validate = createValidator(StackDTO);

    @Property()
    approved: boolean;

    @Property({ nullable: true })
    imageUrl: string;

    @Property()
    id: number;

    // Testing
    @Property({ nullable: true })
    owner: any;

    @Property()
    groups: any[];

    @Property()
    stackContext: string;

    @Property()
    defaultGroup: GroupDTO;

    @Property({ nullable: true })
    descriptorUrl: string;

    @Property({ nullable: true })
    description: string;

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


export interface StackUpdateRequest {
    name: string;
    stackContext?: string;
    update_action?: "add" | "remove";
    user_ids?: Array<number>;
    // Owner
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
export class StackDeleteResponse {

    static validate = createValidator(StackDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => IdDto)
    data: IdDto[];

}

// StackGetResponse
// StackCreateRequest
// StackCreateResponse
// StackUpdateRequest
// StackUpdateResponse
// StackDeleteResponse





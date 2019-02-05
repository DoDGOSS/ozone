import { Model, Property } from "../../lib/openapi/decorators";
import { createLazyComponentValidator } from "../common";


@Model()
export class ProfileReference {

    @Property({ nullable: true })
    userId?: string;

    @Property({ nullable: true })
    userRealName?: string;

}


@Model()
export class UserReference {

    @Property()
    userId: string;

}


@Model({ name: "Dashboard" })
export class DashboardDTO {

    static validate = createLazyComponentValidator(DashboardDTO);

    @Property()
    EDashboardLayoutList: string;

    @Property()
    alteredByAdmin: string;

    @Property()
    createdBy: ProfileReference;

    @Property()
    createdDate: string;

    @Property()
    dashboardPosition: number;

    @Property({ nullable: true })
    description?: string;

    @Property()
    editedDate: string;

    @Property()
    groups: any[];

    @Property()
    guid: string;

    @Property({ nullable: true })
    iconImageUrl?: string;

    @Property()
    isGroupDashboard: boolean;

    @Property()
    isdefault: boolean;

    @Property()
    layoutConfig: string;

    @Property()
    locked: boolean;

    @Property()
    markedForDeletion: boolean;

    @Property()
    name: string;

    @Property()
    prettyCreatedDate: string;

    @Property()
    prettyEditedDate: string;

    @Property()
    publishedToStore: boolean;

    @Property({ nullable: true })
    stack?: any;

    @Property({ nullable: true })
    type?: any;

    @Property()
    user: UserReference;

}


@Model()
export class DashboardGetResponse {

    static validate = createLazyComponentValidator(DashboardGetResponse);

    @Property()
    success: boolean;

    @Property()
    results: number;

    @Property(() => DashboardDTO)
    data: DashboardDTO[];

}


export interface DashboardUpdateRequest {
    name: string;
    guid: string;
    iconImageUrl?:string;
    isdefault?: boolean;
    locked?: boolean;
    description?: string;
    layoutConfig?: string;
    dashboardPosition?: number;
}

export interface DashboardUpdateParams {
    user_id?: number;
    isGroupDashboard?: boolean;
    adminEnabled?: boolean;
}


@Model()
export class DashboardUpdateResponse {

    static validate = createLazyComponentValidator(DashboardUpdateResponse);

    @Property()
    success: boolean;

    @Property(() => DashboardDTO)
    data: DashboardDTO[];

}

import { createValidator, Model, Property } from "@ozone/openapi-decorators";

import { IdDTO } from "./IdDTO";

@Model({ name: "User" })
export class UserDTO {
    static validate = createValidator(UserDTO);

    @Property()
    id: number;

    @Property()
    username: string;

    @Property()
    userRealName: string;

    @Property()
    email: string;

    @Property({ nullable: true })
    hasPWD?: string;

    @Property({ nullable: true, readOnly: true })
    lastLogin?: string;

    @Property({ readOnly: true })
    totalDashboards: number;

    @Property({ readOnly: true })
    totalGroups: number;

    @Property({ readOnly: true })
    totalStacks: number;

    @Property({ readOnly: true })
    totalWidgets: number;
}

@Model({ name: "Username" })
export class UsernameDTO {
    @Property()
    username: string;
}

@Model()
export class UserGetResponse {
    static validate = createValidator(UserGetResponse);

    @Property()
    success: boolean;

    @Property()
    results: number;

    @Property(() => UserDTO)
    data: UserDTO[];
}

export interface UserCreateRequest {
    username: string;
    userRealName: string;
    email: string;
}

@Model()
export class UserCreateResponse {
    static validate = createValidator(UserCreateResponse);

    @Property()
    success: boolean;

    @Property(() => UserDTO)
    data: UserDTO[];
}

export interface UserUpdateRequest {
    id: number;
    username: string;
    userRealName: string;
    email: string;
}

@Model()
export class UserUpdateResponse {
    static validate = createValidator(UserUpdateResponse);

    @Property()
    success: boolean;

    @Property(() => UserDTO)
    data: UserDTO[];
}

@Model()
export class UserDeleteResponse {
    static validate = createValidator(UserDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => IdDTO)
    data: IdDTO[];
}

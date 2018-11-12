export interface UserDTO {
    id: number;

    username: string;
    userRealName: string;
    email: string;

    lastLogin: any | null;
    hasPWD: null;

    totalDashboards: number;
    totalStacks: number;
    totalGroups: number;
    totalWidgets: number;
}

export interface UserGetResponse {
    success: boolean;
    results: number;
    data: UserDTO[];
}

export interface UserCreateRequest {
    username: string;
    userRealName: string;
    email: string;
}

export interface UserCreateResponse {
    success: boolean;
    data: UserDTO[];
}

export interface UserUpdateRequest {
    id: number;
    username: string;
    userRealName: string;
    email: string;
}

export interface UserUpdateResponse {
    success: boolean;
    data: UserDTO[];
}

export interface UserDeleteResponse {
    success: boolean;
    data: Array<{ id: number }>;
}

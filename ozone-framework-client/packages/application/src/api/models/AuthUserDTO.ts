import { createValidator } from "./validate";
import { AUTH_GROUP_SCHEMA, AUTH_USER_SCHEMA } from "./schemas/auth.schema";

export interface AuthUserDTO {
    id: number;
    username: string;
    userRealName: string;
    email?: string;
    isAdmin: boolean;
    groups: AuthGroupDTO[];
    theme?: string | undefined;
}

export const validateAuthUser = createValidator<AuthUserDTO>(AUTH_USER_SCHEMA);

export interface AuthGroupDTO {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    email?: string;
    status: "active" | "inactive";
    automatic: boolean;
}

export const validateAuthGroup = createValidator<AuthGroupDTO>(AUTH_GROUP_SCHEMA);

import { UserDTO } from "../api/models/UserDTO";

import { User } from "../models/User";

import { optional } from "../utility";

export function userFromJson(dto: UserDTO): User {
    return new User({
        displayName: dto.userRealName,
        email: dto.email,
        hasPWD: optional(dto.hasPWD),
        id: dto.id,
        lastLogin: optional(dto.lastLogin),
        metadata: {
            totalDashboards: dto.totalDashboards,
            totalStacks: dto.totalStacks,
            totalGroups: dto.totalGroups,
            totalWidgets: dto.totalWidgets
        },
        username: dto.username
    });
}

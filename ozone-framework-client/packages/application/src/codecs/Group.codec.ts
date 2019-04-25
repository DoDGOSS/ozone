import { GroupDTO } from "../api/models/GroupDTO";

import { Group } from "../models/Group";

import { optional } from "../utility";

export function groupFromJson(dto: GroupDTO): Group {
    return new Group({
        description: optional(dto.description),
        displayName: optional(dto.displayName),
        email: optional(dto.email),
        id: dto.id,
        isAutomatic: dto.automatic,
        isStackDefault: dto.stackDefault,
        metadata: {
            totalStacks: dto.totalStacks,
            totalUsers: dto.totalUsers,
            totalWidgets: dto.totalWidgets
        },
        name: dto.name,
        status: dto.status
    });
}

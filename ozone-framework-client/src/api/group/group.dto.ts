export interface GroupDTO {
    id: number;

    name: string;
    displayName?: string;
    description?: string;
    email?: string;

    status: "active" | "inactive";
    stackDefault: boolean;
    automatic: boolean;

    totalStacks: number;
    totalUsers: number;
    totalWidgets: number;
}

export interface GroupGetResponse {
    results: number;
    data: GroupDTO[];
}

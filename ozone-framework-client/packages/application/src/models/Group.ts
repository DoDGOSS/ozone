export class GroupProps {
    description?: string;
    displayName?: string;
    email?: string;
    id: number;
    isAutomatic: boolean;
    isStackDefault: boolean;
    metadata?: {
        totalStacks?: number;
        totalUsers?: number;
        totalWidgets?: number;
    };
    name: string;
    status: "active" | "inactive";

    constructor(props: PropertiesOf<GroupProps>) {
        Object.assign(this, props);
    }
}

export class Group extends GroupProps {
    get isActive(): boolean {
        return this.status === "active";
    }
}

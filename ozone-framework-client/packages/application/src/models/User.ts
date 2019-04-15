export class UserProps {
    displayName: string;
    email: string;
    hasPWD?: string;
    id: number;
    lastLogin?: string;
    metadata?: {
        totalDashboards?: number;
        totalStacks?: number;
        totalGroups?: number;
        totalWidgets?: number;
    };
    username: string;

    constructor(props: PropertiesOf<UserProps>) {
        Object.assign(this, props);
    }
}

export class User extends UserProps {}

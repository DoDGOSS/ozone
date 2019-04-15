import { Dashboard } from "./Dashboard";

export class StackProps {
    approved: boolean;
    context: string;
    dashboards: Dictionary<Dashboard>;
    description?: string;
    descriptorUrl?: string;
    id: number;
    imageUrl?: string;
    name: string;
    owner?: {
        username: string;
    };

    constructor(props: PropertiesOf<StackProps>) {
        Object.assign(this, props);
    }
}

export class Stack extends StackProps {}

import { GroupDTO } from "../../api/models/GroupDTO";
import { UsernameDTO } from "../../api/models/UserDTO";
import { PropertiesOf } from "../../types";
import { DashboardMap } from "../../codecs/Dashboard.codec";

export class StackProps {
    approved: boolean;
    context: string;
    dashboards: DashboardMap;
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

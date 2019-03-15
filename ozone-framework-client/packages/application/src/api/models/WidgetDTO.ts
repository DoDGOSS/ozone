import { createValidator, Model, Property } from "@ozone/openapi-decorators";

import { GroupDTO } from "./GroupDTO";
import { IntentsDTO } from "./IntentDTO";
import { UserDTO } from "./UserDTO";
import { WidgetTypeDTO, WidgetTypeReference } from "./WidgetTypeDTO";

@Model({ name: "WidgetProperties" })
export class WidgetPropertiesDTO {
    @Property()
    universalName: string;

    @Property()
    namespace: string;

    @Property()
    description: string;

    @Property()
    url: string;

    @Property()
    headerIcon: string;

    @Property()
    image: string;

    @Property()
    smallIconUrl: string;

    @Property()
    mediumIconUrl: string;

    @Property()
    width: number;

    @Property()
    height: number;

    @Property()
    x: number;

    @Property()
    y: number;

    @Property()
    minimized: boolean;

    @Property()
    maximized: boolean;

    @Property()
    widgetVersion: string;

    @Property({ readOnly: true })
    totalUsers: number;

    @Property({ readOnly: true })
    totalGroups: number;

    @Property()
    singleton: boolean;

    @Property()
    visible: boolean;

    @Property()
    background: boolean;

    @Property()
    mobileReady: boolean;

    @Property({ nullable: true })
    descriptorUrl?: string;

    @Property()
    definitionVisible: boolean;

    @Property()
    directRequired: any[];

    @Property()
    allRequired: any[];

    @Property(() => IntentsDTO)
    intents: IntentsDTO;

    @Property(() => WidgetTypeDTO)
    widgetTypes: WidgetTypeDTO[];
}

@Model({ name: "Widget" })
export class WidgetDTO {
    static validate = createValidator(WidgetDTO);

    @Property()
    id: string;

    @Property()
    namespace: string;

    @Property()
    path: string;

    @Property(() => WidgetPropertiesDTO)
    value: WidgetPropertiesDTO;
}

export interface WidgetCreateRequest {
    displayName: string;
    widgetVersion: string;
    description: string;
    widgetUrl: string;
    imageUrlSmall: string; // Small Icon
    imageUrlMedium: string; // Large Icon
    width: number;
    height: number;
    widgetGuid: string;
    universalName: string;
    visible: boolean;
    background: boolean;
    singleton: boolean;
    mobileReady: boolean;
    widgetTypes: WidgetTypeReference[];
    descriptorUrl?: string;
    // intents?: IntentsDTO;
}

export interface WidgetUpdateRequest extends WidgetCreateRequest {
    id: string;
}

@Model()
export class WidgetUpdateUsersResponse {
    static validate = createValidator(WidgetUpdateUsersResponse);

    @Property()
    success: boolean;

    @Property(() => UserDTO)
    data: UserDTO[];
}

@Model()
export class WidgetUpdateGroupsResponse {
    static validate = createValidator(WidgetUpdateGroupsResponse);

    @Property()
    success: boolean;

    @Property(() => GroupDTO)
    data: GroupDTO[];
}

@Model()
export class WidgetCreateResponse {
    static validate = createValidator(WidgetCreateResponse);

    @Property()
    success: boolean;

    @Property(() => WidgetDTO)
    data: WidgetDTO[];
}

@Model()
export class WidgetDeleteIdDTO {
    @Property()
    id: string;

    @Property()
    value: object;
}

@Model()
export class WidgetDeleteResponse {
    static validate = createValidator(WidgetDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => WidgetDeleteIdDTO)
    data: WidgetDeleteIdDTO[];
}

@Model()
export class WidgetGetResponse {
    static validate = createValidator(WidgetGetResponse);

    @Property()
    success: boolean;

    @Property()
    results: number;

    @Property(() => WidgetDTO)
    data: WidgetDTO[];
}

import { Model, Property } from "../../lib/openapi/decorators";

import { IntentsDTO } from "./intent-dto";
import { WidgetTypeDTO, WidgetTypeReference } from "./widget-type-dto";

import { createLazyComponentValidator } from "../common";


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

    static validate = createLazyComponentValidator(WidgetDTO);

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
    name: string;
    version: string;
    description: string;
    url: string;
    headerIcon: string;  // Small Icon
    image: string;  // Large Icon
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
    title: string;
}


@Model()
export class WidgetCreateResponse {

    static validate = createLazyComponentValidator(WidgetCreateResponse);

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

    static validate = createLazyComponentValidator(WidgetDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => WidgetDeleteIdDTO)
    data: WidgetDeleteIdDTO[];

}


@Model()
export class WidgetGetResponse {

    static validate = createLazyComponentValidator(WidgetGetResponse);

    @Property()
    success: boolean;

    @Property()
    results: number;

    @Property(() => WidgetDTO)
    data: WidgetDTO[];

}




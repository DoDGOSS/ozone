import { Model, Property } from "../../lib/openapi/decorators";

import { IntentsDTO } from "./intent-dto";
import { WidgetTypeDTO } from "./widget-type-dto";

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




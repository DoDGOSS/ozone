import { WidgetDefinition } from "./interfaces";

import {
    groupAdminWidgetDef,
    sampleWidgetDef,
    systemConfigWidgetDef,
    userAdminWidgetDef,
    widgetAdminWidgetDef
} from "./system-widgets";

const IMAGE_ROOT_URL = "http://localhost:3000/images";

export interface Widget {
    id: string;
    universalName: string;
    title: string;
    iconUrl: string;
    definition: WidgetDefinition;
}

export const ADMIN_WIDGETS: Widget[] = [
    {
        id: "48edfe94-4291-4991-a648-c19a903a663b",
        universalName: "org.ozoneplatform.owf.admin.appcomponentmanagement",
        title: "Widgets",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/widgets-manager.png`,
        definition: widgetAdminWidgetDef
    },
    {
        id: "391dd2af-a207-41a3-8e51-2b20ec3e7241",
        universalName: "org.ozoneplatform.owf.admin.appmanagement",
        title: "Dashboards",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/stacks-manager.png`,
        definition: sampleWidgetDef
    },
    {
        id: "af180bfc-3924-4111-93de-ad6e9bfc060e",
        universalName: "org.ozoneplatform.owf.admin.configuration",
        title: "System Configuration",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/configuration-manager.png`,
        definition: systemConfigWidgetDef
    },
    {
        id: "53a2a879-442c-4012-9215-a17604dedff7",
        universalName: "org.ozoneplatform.owf.admin.groupmanagement",
        title: "Groups",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/groups-manager.png`,
        definition: groupAdminWidgetDef
    },
    {
        id: "cad8dc1b-1f33-487c-8d85-21c8aeac5f49",
        universalName: "org.ozoneplatform.owf.admin.usermanagement",
        title: "Users",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/users-manager.png`,
        definition: userAdminWidgetDef
    }
];

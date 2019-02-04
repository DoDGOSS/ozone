import { observable, runInAction } from "mobx";
import { injectable } from "../inject";
import { WidgetDefinition } from "./DashboardStore";
import { groupAdminWidgetDef, sampleWidgetDef, userAdminWidgetDef } from "./DefaultDashboard";
// import React from 'react';
// import { UsersWidget } from "../components/admin/widgets/Users/UsersWidget";
// import { GroupsWidget } from "../components/admin/widgets/Groups/GroupsWidget";
// import { MosaicNode } from 'react-mosaic-component';


interface Widget {
    id: string;
    universalName: string;
    title: string;
    iconUrl: string;
    url?:string;
    definition: WidgetDefinition;
}

export const IMAGE_ROOT_URL = "http://localhost:3000/images";


const ADMIN_WIDGETS: Widget[] = [
    {
        id: "48edfe94-4291-4991-a648-c19a903a663b",
        universalName: "org.ozoneplatform.owf.admin.appcomponentmanagement",
        title: "Widgets",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/widgets-manager.png`,
        definition: sampleWidgetDef

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
        definition: sampleWidgetDef

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

const USER_WIDGETS: Widget[] = [
    {
        id: "18070c45-5f6a-4460-810c-6e3496495ec4",
        universalName: "org.ozoneplatform.owf.XXXX.XXXX",
        title: "Sample Widget 1",
        url: "#",
        definition: sampleWidgetDef,
        iconUrl: `${IMAGE_ROOT_URL}/widgets/widgets-manager.png`
    },
    {
        id: "48edfe94-4291-4991-a648-c19a9023132",
        universalName: "org.ozoneplatform.owf.XXXX.XXXX",
        title: "Sample Widget 2",
        url: "#",
        definition: sampleWidgetDef,
        iconUrl: `${IMAGE_ROOT_URL}/widgets/users-manager.png`
    },
    {
        id: "48edfe94-4291-4991-a648-c19a9123123b",
        universalName: "org.ozoneplatform.owf.XXXX.XXXX",
        title: "Sample Widget 3",
        url: "#",
        definition: sampleWidgetDef,
        iconUrl: `${IMAGE_ROOT_URL}/widgets/widgets-manager.png`
    },
    {
        id: "48edfe94-4291-4991-a648-c19a912312313b",
        universalName: "org.ozoneplatform.owf.XXXX.XXXX",
        title: "Sample Widget 4",
        url: "#",
        definition: sampleWidgetDef,
        iconUrl: `${IMAGE_ROOT_URL}/widgets/users-manager.png`
    },
];


@injectable()
export class WidgetStore {

    @observable
    adminWidgets: Widget[];

    @observable
    userWidgets: Widget[];


    constructor() {
        runInAction("initialize", () => {
            this.adminWidgets = ADMIN_WIDGETS;
            this.userWidgets = USER_WIDGETS;
        });
    }



}

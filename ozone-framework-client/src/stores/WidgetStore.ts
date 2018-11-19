import { observable, runInAction } from "mobx";
import { injectable } from "../inject";


interface Widget {
    id: string;
    universalName: string;
    title: string;
    iconUrl: string;
}

export const IMAGE_ROOT_URL = "http://localhost:3000/images";


const ADMIN_WIDGETS: Widget[] = [
    {
        id: "48edfe94-4291-4991-a648-c19a903a663b",
        universalName: "org.ozoneplatform.owf.admin.appcomponentmanagement",
        title: "Widgets",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/widgets-manager.png`
    },
    {
        id: "391dd2af-a207-41a3-8e51-2b20ec3e7241",
        universalName: "org.ozoneplatform.owf.admin.appmanagement",
        title: "Stacks",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/stacks-manager.png`
    },
    {
        id: "af180bfc-3924-4111-93de-ad6e9bfc060e",
        universalName: "org.ozoneplatform.owf.admin.configuration",
        title: "System Configuration",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/configuration-manager.png`
    },
    {
        id: "53a2a879-442c-4012-9215-a17604dedff7",
        universalName: "org.ozoneplatform.owf.admin.groupmanagement",
        title: "Groups",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/groups-manager.png`
    },
    {
        id: "38070c45-5f6a-4460-810c-6e3496495ec4",
        universalName: "org.ozoneplatform.owf.admin.usermanagement",
        title: "Users",
        iconUrl: `${IMAGE_ROOT_URL}/widgets/users-manager.png`
    }
];


@injectable()
export class WidgetStore {

    @observable
    adminWidgets: Widget[];


    constructor() {
        runInAction("initialize", () => {
            this.adminWidgets = ADMIN_WIDGETS;
        });
    }

}

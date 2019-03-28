import { Widget } from "../models/Widget";
import { adminWidgetType } from "./widget-types";

interface AdminWidgetProps {
    id: string;
    imageUrl: string;
    title: string;
    universalName: string;
    url: string;
}

function createAdminWidget(props: AdminWidgetProps): Widget {
    return new Widget({
        height: 400,
        id: props.id,
        images: {
            smallUrl: props.imageUrl,
            largeUrl: props.imageUrl
        },
        intents: {
            send: [],
            receive: []
        },
        isBackground: false,
        isDefinitionVisible: true,
        isMaximized: false,
        isMinimized: false,
        isMobileReady: false,
        isSingleton: false,
        isVisible: true,
        title: props.title,
        types: [adminWidgetType],
        universalName: props.universalName,
        url: props.url,
        width: 400,
        x: 0,
        y: 0
    });
}

export const widgetAdminWidget = createAdminWidget({
    id: "48edfe94-4291-4991-a648-c19a903a663b",
    imageUrl: "images/widgets/widgets-manager.png",
    title: "Widget Administration",
    universalName: "org.owfgoss.owf.admin.WidgetAdmin",
    url: "local:widget_admin"
});

export const dashboardAdminWidget = createAdminWidget({
    id: "0b7a39e0-87a2-4077-801b-2e5160fb2288",
    imageUrl: "images/widgets/dashboards-manager.png",
    title: "Dashboard Administration",
    universalName: "org.owfgoss.owf.admin.DashboardAdmin",
    url: "local:dashboard_admin"
});

export const userAdminWidget = createAdminWidget({
    id: "105a20c8-f81b-47fb-b683-af3a1cc4ec50",
    imageUrl: "images/widgets/users-manager.png",
    title: "User Administration",
    universalName: "org.owfgoss.owf.admin.UserAdmin",
    url: "local:user_admin"
});

export const groupAdminWidget = createAdminWidget({
    id: "17a6e77b-304f-47e6-a6be-16143ee3b2fb",
    imageUrl: "images/widgets/groups-manager.png",
    title: "Group Administration",
    universalName: "org.owfgoss.owf.admin.GroupAdmin",
    url: "local:group_admin"
});

export const systemConfigWidget = createAdminWidget({
    id: "a224eb26-31bc-466a-bce2-dccb09e5e2e9",
    imageUrl: "images/widgets/configuration-manager.png",
    title: "System Configuration",
    universalName: "org.owfgoss.owf.admin.SystemConfig",
    url: "local:system_config"
});

export const ADMIN_WIDGETS: Widget[] = [
    widgetAdminWidget,
    dashboardAdminWidget,
    userAdminWidget,
    groupAdminWidget,
    systemConfigWidget
];

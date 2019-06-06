import React from "react";

import { StacksWidget } from "../components/admin/widgets/Stacks/StacksWidget";
import { GroupsWidget } from "../components/admin/widgets/Groups/GroupsWidget";
import { SystemConfigWidget } from "../components/admin/widgets/SystemConfig/SystemConfigWidget";
import { UsersWidget } from "../components/admin/widgets/Users/UsersWidget";
import { WidgetsWidget } from "../components/admin/widgets/Widgets/WidgetsWidget";

export const SYSTEM_WIDGET_URLS: { [url: string]: JSX.Element } = {
    "local:widget_admin": <WidgetsWidget />,
    "local:dashboard_admin": <StacksWidget />,
    "local:user_admin": <UsersWidget />,
    "local:group_admin": <GroupsWidget />,
    "local:system_config": <SystemConfigWidget />
};

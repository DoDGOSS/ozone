import React from "react";
import { useBehavior } from "../../../hooks";
import { Button } from "@blueprintjs/core";

import { dashboardStore } from "../../../stores/DashboardStore";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

const _WidgetsButton: React.FC = () => {
    const isActive = useBehavior(mainStore.isWidgetToolbarOpen);

    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    const button = (
        <Button
            minimal
            text="Widgets"
            icon="widget"
            active={isActive}
            disabled={isLocked}
            onClick={mainStore.toggleWidgetToolbar}
            data-element-id="widgets-button"
        />
    );

    return isLocked ? (
        button
    ) : (
        <NavbarTooltip
            title="Widgets"
            shortcut="alt+shift+f"
            description="Open or close the Widgets toolbar to add Widgets to your Dashboard."
        >
            {button}
        </NavbarTooltip>
    );
};

export const WidgetsButton = React.memo(_WidgetsButton);

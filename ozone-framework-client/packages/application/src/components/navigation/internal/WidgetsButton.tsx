import React, { useCallback } from "react";
import { useBehavior } from "../../../hooks";
import { Button } from "@blueprintjs/core";
import { Shortcuts, useHotkey } from "../../../shared/hotkeys";
import { dashboardStore } from "../../../stores/DashboardStore";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

export interface WidgetsButtonProps {
    isLocked: boolean;
}

const _WidgetsButton: React.FC<WidgetsButtonProps> = ({ isLocked }) => {
    const isActive = useBehavior(mainStore.isWidgetToolbarOpen);
    const storeIsOpen = useBehavior(mainStore.isStoreOpen);

    const toggleWidgetToolbar = useCallback(() => {
        if (!isLocked) mainStore.toggleWidgetToolbar();
    }, [isLocked]);

    useHotkey({ combo: Shortcuts.showWidgets, onKeyDown: toggleWidgetToolbar });

    return (
        <NavbarTooltip
            title="Widgets"
            shortcut={Shortcuts.showWidgets}
            description="Open or close the Widgets toolbar to add Widgets to your Dashboard."
            disabled={isLocked}
        >
            <Button
                minimal
                text="Widgets"
                icon="widget"
                active={isActive}
                disabled={isLocked || storeIsOpen}
                onClick={toggleWidgetToolbar}
                data-element-id="widgets-button"
            />
        </NavbarTooltip>
    );
};

export const WidgetsButton = React.memo(_WidgetsButton);

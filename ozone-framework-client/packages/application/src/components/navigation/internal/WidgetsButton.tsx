import React, { useCallback } from "react";
import { Button } from "@blueprintjs/core";

import { useBehavior } from "../../../hooks";
import { Hotkey, useHotkey } from "../../../shared/hotkeys";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

export interface WidgetsButtonProps {
    isLocked: boolean;
}

const _WidgetsButton: React.FC<WidgetsButtonProps> = ({ isLocked }) => {
    const isActive = useBehavior(mainStore.isWidgetToolbarOpen);

    const toggleWidgetToolbar = useCallback(() => {
        if (!isLocked) mainStore.toggleWidgetToolbar();
    }, [isLocked]);

    useHotkey({ combo: Hotkey.showWidgets, onKeyDown: toggleWidgetToolbar });

    return (
        <NavbarTooltip
            title="Widgets"
            shortcut={Hotkey.showWidgets}
            description="Open or close the Widgets toolbar to add Widgets to your Dashboard."
            disabled={isLocked}
        >
            <Button
                minimal
                text="Widgets"
                icon="widget"
                active={isActive}
                disabled={isLocked}
                onClick={toggleWidgetToolbar}
                data-element-id="widgets-button"
            />
        </NavbarTooltip>
    );
};

export const WidgetsButton = React.memo(_WidgetsButton);

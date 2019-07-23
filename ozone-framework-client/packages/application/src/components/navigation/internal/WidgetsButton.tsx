import React, { useCallback } from "react";
import { AnchorButton } from "@blueprintjs/core";

import { useBehavior, useHotkey } from "../../../hooks";
import { Shortcuts } from "../../../shared/hotkeys";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

export interface WidgetsButtonProps {
    isLocked: boolean;
    isStoreOpen: boolean;
}

const _WidgetsButton: React.FC<WidgetsButtonProps> = ({ isLocked, isStoreOpen }) => {
    const isActive = useBehavior(mainStore.isWidgetToolbarOpen);

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
            <AnchorButton
                minimal
                text="Widgets"
                icon="widget"
                active={isActive}
                disabled={isLocked || isStoreOpen}
                onClick={toggleWidgetToolbar}
                data-element-id="widgets-button"
            />
        </NavbarTooltip>
    );
};

export const WidgetsButton = React.memo(_WidgetsButton);

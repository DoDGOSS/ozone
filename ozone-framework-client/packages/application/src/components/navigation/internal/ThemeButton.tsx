import React from "react";
import { Button } from "@blueprintjs/core";

import { useHotkey } from "../../../hooks";
import { Shortcuts } from "../../../shared/hotkeys";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

const _ThemeButton: React.FC = () => {
    useHotkey({ combo: Shortcuts.toggleTheme, onKeyDown: mainStore.toggleTheme });

    return (
        <NavbarTooltip
            title="Theme"
            shortcut={Shortcuts.toggleTheme}
            description="Toggle between light and dark themes."
        >
            <Button minimal icon="moon" onClick={mainStore.toggleTheme} data-element-id="theme-button" />
        </NavbarTooltip>
    );
};

export const ThemeButton = React.memo(_ThemeButton);

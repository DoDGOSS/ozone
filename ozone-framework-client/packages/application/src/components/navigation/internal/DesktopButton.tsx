import React, { useCallback } from "react";
import { Button } from "@blueprintjs/core";

import { useHotkey } from "../../../hooks";
import { Shortcuts } from "../../../shared/hotkeys";

import { NavbarTooltip } from "./NavbarTooltip";

const _DesktopButton: React.FC = () => {
    const showDesktop = useCallback(() => null, []);

    useHotkey({ combo: Shortcuts.showDesktop, onKeyDown: showDesktop });

    return (
        <NavbarTooltip title="OWF" shortcut={Shortcuts.showDesktop} description="Refresh Ozone Widget Framework">
            <Button minimal icon="page-layout" intent="primary" onClick={showDesktop} data-element-id="owf-button" />
        </NavbarTooltip>
    );
};

export const DesktopButton = React.memo(_DesktopButton);

import React, { useCallback } from "react";
import { Button } from "@blueprintjs/core";

import { Hotkey, useHotkey } from "../../../shared/hotkeys";

import { NavbarTooltip } from "./NavbarTooltip";

const _StoreButton: React.FC = () => {
    const showStore = useCallback(() => null, []);

    useHotkey({ combo: Hotkey.showStore, onKeyDown: showStore });

    return (
        <NavbarTooltip title="AppsMall Center" shortcut={Hotkey.showStore} description="Open AppsMall">
            <Button minimal icon="shopping-cart" onClick={showStore} data-element-id="center-button" />
        </NavbarTooltip>
    );
};

export const StoreButton = React.memo(_StoreButton);

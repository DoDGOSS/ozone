import React, { useCallback } from "react";
import { Button } from "@blueprintjs/core";

import { useHotkey } from "../../../hooks";
import { Shortcuts } from "../../../shared/hotkeys";

import { mainStore } from "../../../stores/MainStore";
import { NavbarTooltip } from "./NavbarTooltip";

const _StoreButton: React.FC = () => {
    const toggleStore = () => {
        mainStore.toggleStore();
    };

    useHotkey({ combo: Shortcuts.showStore, onKeyDown: toggleStore });

    return (
        <NavbarTooltip title="Marketplace" shortcut={Shortcuts.showStore} description="Open Marketplace">
            <Button minimal icon="shopping-cart" onClick={toggleStore} data-element-id="store-button" />
        </NavbarTooltip>
    );
};

export const StoreButton = React.memo(_StoreButton);

import React from "react";
import { Button } from "@blueprintjs/core";

import { useBehavior } from "../../../hooks";
import { Hotkey, useHotkey } from "../../../shared/hotkeys";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

const _StacksButton: React.FC = () => {
    const isActive = useBehavior(mainStore.isStackDialogVisible);

    useHotkey({ combo: Hotkey.showStacks, onKeyDown: mainStore.showStackDialog });

    return (
        <NavbarTooltip
            title="Stacks"
            shortcut={Hotkey.showStacks}
            description="Open the Stacks window to start or manage your Stacks."
        >
            <Button
                minimal
                text="Stacks"
                icon="control"
                active={isActive}
                onClick={mainStore.showStackDialog}
                data-element-id="stacks-button"
            />
        </NavbarTooltip>
    );
};

export const StacksButton = React.memo(_StacksButton);

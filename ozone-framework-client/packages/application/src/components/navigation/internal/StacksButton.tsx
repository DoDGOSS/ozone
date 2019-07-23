import React from "react";
import { Button } from "@blueprintjs/core";

import { useBehavior, useHotkey } from "../../../hooks";
import { Shortcuts } from "../../../shared/hotkeys";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

const _StacksButton: React.FC = () => {
    const isActive = useBehavior(mainStore.isStackDialogVisible);

    useHotkey({ combo: Shortcuts.showStacks, onKeyDown: mainStore.showStackDialog });

    return (
        <NavbarTooltip
            title="Stacks"
            shortcut={Shortcuts.showStacks}
            description="Open the Stacks window to start or manage your Stacks."
        >
            <Button
                minimal
                text="Stacks"
                icon="control"
                active={isActive}
                onClick={() => {
                    mainStore.showStackDialog();
                    mainStore.hideStore();
                }}
                data-element-id="stacks-button"
            />
        </NavbarTooltip>
    );
};

export const StacksButton = React.memo(_StacksButton);

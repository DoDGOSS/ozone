import React from "react";
import { useBehavior } from "../../../hooks";
import { Button } from "@blueprintjs/core";

import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";

const _StacksButton: React.FC = () => {
    const isActive = useBehavior(mainStore.isStackDialogVisible);

    return (
        <NavbarTooltip
            title="Stacks"
            shortcut="alt+shift+c"
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

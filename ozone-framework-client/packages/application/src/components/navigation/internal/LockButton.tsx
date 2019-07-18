import React from "react";
import { Button } from "@blueprintjs/core";

import { Dashboard } from "../../../models/Dashboard";

import { NavbarTooltip } from "./NavbarTooltip";

export interface LockButtonProps {
    dashboard: Dashboard;
    isLocked: boolean;
}

const _LockButton: React.FC<LockButtonProps> = ({ dashboard, isLocked }) => {
    const tooltipProps = {
        title: isLocked ? "Unlock Dashboard" : "Lock Dashboard",
        description: isLocked
            ? "Unlock the current Dashboard to allow modifications"
            : "Lock the current Dashboard to prevent modifications"
    };

    const buttonProps = {
        icon: isLocked ? "lock" : "unlock",
        onClick: isLocked ? dashboard.unlock : dashboard.lock
    } as const;

    return (
        <NavbarTooltip {...tooltipProps}>
            <Button minimal {...buttonProps} />
        </NavbarTooltip>
    );
};

export const LockButton = React.memo(_LockButton);

import React from "react";
import { useBehavior } from "../../../hooks";
import { Button } from "@blueprintjs/core";

import { dashboardStore } from "../../../stores/DashboardStore";

import { NavbarTooltip } from "./NavbarTooltip";

const _LockButton: React.FC = () => {
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

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

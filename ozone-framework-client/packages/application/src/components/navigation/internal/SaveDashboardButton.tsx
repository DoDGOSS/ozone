import React from "react";
import { AnchorButton } from "@blueprintjs/core";
import { dashboardStore } from "../../../stores/DashboardStore";

export interface SaveDashboardButtonProps {
    isStoreOpen: boolean;
}

const _SaveDashboardButton: React.FC<SaveDashboardButtonProps> = ({ isStoreOpen }) => (
    <AnchorButton
        data-element-id="save-dashboard"
        minimal
        icon="floppy-disk"
        onClick={dashboardStore.saveCurrentDashboard}
        disabled={isStoreOpen}
    />
);

export const SaveDashboardButton = React.memo(_SaveDashboardButton);

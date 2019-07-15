import React from "react";
import { Button } from "@blueprintjs/core";
import { dashboardStore } from "../../../stores/DashboardStore";

const _SaveDashboardButton: React.FC = () => (
    <Button minimal icon="floppy-disk" onClick={dashboardStore.saveCurrentDashboard} />
);

export const SaveDashboardButton = React.memo(_SaveDashboardButton);

import React from "react";

import { Menu, MenuItem } from "@blueprintjs/core";

import { Panel, PanelState } from "../../../models/panel";
import { dashboardService } from "../../../services/DashboardService";

import { DashboardPath } from "../types";

export interface OptionsMenuProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({ panel, path }) => {
    const isFitDisabled = panel.state().value.widgets.length > 1;

    return (
        <Menu>
            <MenuItem
                text="Fit"
                disabled={isFitDisabled}
                onClick={() => dashboardService.setPanelLayout(panel, path, "fit")}
            />

            <MenuItem text="Tabbed" onClick={() => dashboardService.setPanelLayout(panel, path, "tabbed")} />

            <MenuItem text="Accordion" onClick={() => dashboardService.setPanelLayout(panel, path, "accordion")} />

            <MenuItem text="Portal" onClick={() => dashboardService.setPanelLayout(panel, path, "portal")} />
        </Menu>
    );
};

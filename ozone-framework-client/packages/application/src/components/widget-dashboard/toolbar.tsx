import styles from "./index.scss";

import React from "react";

import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";

import { ExpandButton, RemoveButton } from "../../features/MosaicDashboard";

import { Panel, PanelState } from "../../models/dashboard/types";

import { dashboardService } from "../../stores/DashboardService";

import { DashboardPath } from "./types";

export interface OptionsButtonProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

export const OptionsButton: React.FC<OptionsButtonProps> = ({ panel, path }) => (
    <Popover position={Position.BOTTOM_RIGHT} minimal={true} content={<OptionsMenu panel={panel} path={path} />}>
        <Button className={styles.optionsButton} minimal={true} icon="cog" />
    </Popover>
);

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

export const createWidgetToolbar = (panel: Panel<PanelState>, path: DashboardPath) =>
    React.Children.toArray([
        <OptionsButton key={0} panel={panel} path={path} />,
        <ExpandButton key={1} />,
        <RemoveButton key={2} />
    ]);

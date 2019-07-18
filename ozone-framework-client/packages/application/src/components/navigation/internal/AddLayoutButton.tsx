import React from "react";
import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";

import { dashboardService } from "../../../services/DashboardService";

const _AddLayoutMenu: React.FC = () => (
    <Menu>
        <MenuItem text="Fit Panel" onClick={() => dashboardService.addLayout_TEMP("fit")} />
        <MenuItem
            text="Tabbed Panel"
            data-element-id="tabbed-panel"
            onClick={() => dashboardService.addLayout_TEMP("tabbed")}
        />
        <MenuItem text="Accordion Panel" onClick={() => dashboardService.addLayout_TEMP("accordion")} />
        <MenuItem text="Portal Panel" onClick={() => dashboardService.addLayout_TEMP("portal")} />
    </Menu>
);

const AddLayoutMenu = React.memo(_AddLayoutMenu);

export interface AddLayoutButtonProps {
    isLocked: boolean;
}

const _AddLayoutButton: React.FC<AddLayoutButtonProps> = ({ isLocked }) => {
    if (isLocked) return null;

    return (
        <Popover position={Position.BOTTOM_RIGHT} minimal={true} content={<AddLayoutMenu />}>
            <Button minimal icon="add" data-element-id="add-layout" />
        </Popover>
    );
};

export const AddLayoutButton = React.memo(_AddLayoutButton);

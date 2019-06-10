import React from "react";
import { Menu } from "@blueprintjs/core";

import { Panel, PanelState } from "../../../models/panel";

import { DashboardPath } from "../types";

import { LayoutMenuItem } from "./LayoutMenuItem";

export interface OptionsMenuProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

const _OptionsMenu: React.FC<OptionsMenuProps> = (props) => {
    return (
        <Menu>
            <LayoutMenuItem {...props} text="Fit" layoutType="fit" />
            <LayoutMenuItem {...props} text="Tabbed" layoutType="tabbed" />
            <LayoutMenuItem {...props} text="Accordion" layoutType="accordion" />
            <LayoutMenuItem {...props} text="Portal" layoutType="portal" />
        </Menu>
    );
};

export const OptionsMenu = React.memo(_OptionsMenu);

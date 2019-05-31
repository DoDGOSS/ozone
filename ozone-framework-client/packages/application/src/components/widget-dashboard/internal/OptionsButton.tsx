import React from "react";
import { Button, Popover, Position } from "@blueprintjs/core";

import { Panel, PanelState } from "../../../models/panel";

import { DashboardPath } from "../types";
import { OptionsMenu } from "./OptionsMenu";

export interface OptionsButtonProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

const _OptionsButton: React.FC<OptionsButtonProps> = ({ panel, path }) => {
    return (
        <Popover minimal position={Position.BOTTOM_RIGHT} content={<OptionsMenu panel={panel} path={path} />}>
            <Button minimal icon="cog" />
        </Popover>
    );
};

export const OptionsButton = React.memo(_OptionsButton);

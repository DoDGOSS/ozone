import React, { useCallback } from "react";
import { Icon, MenuItem } from "@blueprintjs/core";

import { LayoutType } from "../../../models/panel";
import { dashboardService } from "../../../services/DashboardService";

import { OptionsMenuProps } from "./OptionsMenu";

export interface LayoutMenuItemProps extends OptionsMenuProps {
    text: string;
    layoutType: LayoutType;
}

const _LayoutMenuItem: React.FC<LayoutMenuItemProps> = (props) => {
    const { panel, path, text, layoutType } = props;

    const setPanelLayout = useCallback(() => dashboardService.setPanelLayout(panel, path, layoutType), [
        panel,
        path,
        layoutType
    ]);

    const isCurrent = layoutType === panel.type;
    const isDisabled = isCurrent || (layoutType === "fit" && panel.widgetCount > 1);

    return (
        <MenuItem
            text={text}
            disabled={isDisabled}
            labelElement={isCurrent ? <Icon icon="small-tick" /> : null}
            onClick={setPanelLayout}
        />
    );
};

export const LayoutMenuItem = React.memo(_LayoutMenuItem);

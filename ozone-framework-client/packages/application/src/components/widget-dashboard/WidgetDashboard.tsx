import React, { useCallback } from "react";
import { useBehavior } from "../../hooks";

import { PropsBase } from "../../common";
import { DashboardNode } from "../../stores/interfaces";

import { dashboardService } from "../../stores/DashboardService";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { DashboardLayout, DashboardPath } from "./types";
import { DashboardPanel } from "./layout/DashboardPanel";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

export const WidgetDashboard: React.FC<PropsBase> = (props) => {
    const { className } = props;

    const themeClass = useBehavior(mainStore.themeClass);
    const dashboard = useBehavior(dashboardStore.dashboard);

    const { tree, panels } = useBehavior(dashboard.state);

    const setLayout = useCallback((currentNode: DashboardNode | null) => dashboardService.setLayout(currentNode), []);

    return (
        <div className={classNames(styles.dashboard, className)}>
            <DashboardLayout
                className={classNames("mosaic-blueprint-theme", "mosaic", "mosaic-drop-target", themeClass)}
                value={tree}
                onChange={setLayout}
                renderTile={(id: string, path: DashboardPath) => <DashboardPanel panel={panels[id]} path={path} />}
            />
        </div>
    );
};

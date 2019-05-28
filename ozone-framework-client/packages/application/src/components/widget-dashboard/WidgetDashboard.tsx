import * as styles from "./index.scss";

import React, { useCallback, useState } from "react";
import { useBehavior } from "../../hooks";

import { Spinner } from "@blueprintjs/core";

import { PropsBase } from "../../common";

import { dashboardService } from "../../stores/DashboardService";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { DashboardLayout, DashboardNode, DashboardPath } from "./types";
import { DashboardPanel } from "./layout/DashboardPanel";

import { classNames } from "../../utility";

export const WidgetDashboard: React.FC<PropsBase> = (props) => {
    const { className } = props;

    const themeClass = useBehavior(mainStore.themeClass);

    const isLoading = useBehavior(dashboardStore.isLoading);
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { tree, panels } = useBehavior(dashboard.state);

    const [isDragging, setIsDragging] = useState(false);

    const onChange = useCallback((currentNode: DashboardNode | null) => {
        setIsDragging(true);
        dashboardService.setLayoutFast(currentNode);
    }, []);

    const onRelease = useCallback((currentNode: DashboardNode | null) => {
        setIsDragging(false);
        dashboardService.setLayout(currentNode);
    }, []);

    if (isLoading) {
        return <Spinner className={styles.loadingSpinner} />;
    }

    return (
        <div className={classNames(styles.dashboard, className, { dragging: isDragging })}>
            <DashboardLayout
                className={classNames("mosaic-blueprint-theme", themeClass)}
                value={tree}
                onChange={onChange}
                onRelease={onRelease}
                renderTile={(id: string, path: DashboardPath) => <DashboardPanel panel={panels[id]} path={path} />}
            />
        </div>
    );
};

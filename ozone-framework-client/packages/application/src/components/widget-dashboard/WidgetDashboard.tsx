import * as styles from "./index.scss";

import React, { useCallback, useState } from "react";
import { Spinner } from "@blueprintjs/core";

import { PropsBase } from "../../common";
import { useBehavior } from "../../hooks";
import { dashboardService } from "../../services/DashboardService";
import { isDragging$ } from "../../shared/dragAndDrop";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";
import { systemConfigStore } from "../../stores/SystemConfigStore";
import { classNames } from "../../utility";

import { BackgroundImage } from "../branding/BackgroundImage";

import { DashboardPanel } from "./layout/DashboardPanel";
import { DashboardLayout, DashboardNode, DashboardPath } from "./types";
import { WidgetFrame } from "./WidgetFrame";

export const WidgetDashboard: React.FC<PropsBase> = (props) => {
    const { className } = props;

    const themeClass = useBehavior(mainStore.themeClass);

    const isLoading = useBehavior(dashboardStore.isLoading);
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { backgroundWidgets, tree, panels } = useBehavior(dashboard.state);
    const backgroundImageUrl = useBehavior(systemConfigStore.backgroundImageUrl);

    const [isResizing, setIsResizing] = useState(false);
    const isDragging = useBehavior(isDragging$);

    const onChange = useCallback((currentNode: DashboardNode | null) => {
        setIsResizing(true);
        dashboardService.setLayoutFast(currentNode);
    }, []);

    const onRelease = useCallback((currentNode: DashboardNode | null) => {
        setIsResizing(false);
        dashboardService.setLayout(currentNode);
    }, []);

    if (isLoading) {
        return <Spinner className={styles.loadingSpinner} />;
    }

    document.title = "Ozone - " + dashboard.name;

    return (
        <>
            <div className={classNames(styles.dashboard, className, { "-dragging": isResizing || isDragging })}>
                {!tree && backgroundImageUrl ? (
                    <BackgroundImage imgUrl={backgroundImageUrl} />
                ) : (
                    <DashboardLayout
                        className={classNames("mosaic-blueprint-theme", themeClass)}
                        value={tree}
                        onChange={onChange}
                        onRelease={onRelease}
                        renderTile={(id: string, path: DashboardPath) => (
                            <DashboardPanel panel={panels[id]} path={path} />
                        )}
                    />
                )}
            </div>
            {backgroundWidgets.map((backgroundWidget) => (
                <WidgetFrame key={backgroundWidget.id} widgetInstance={backgroundWidget} />
            ))}
        </>
    );
};

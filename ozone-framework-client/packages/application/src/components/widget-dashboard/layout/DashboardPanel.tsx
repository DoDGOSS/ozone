import styles from "./DashboardPanel.scss";

import React, { ReactNode } from "react";
import { useBehavior } from "../../../hooks";
import { isEqual } from "lodash";

import { isExpandoPanel, isFitPanel, isTabbedPanel, Panel, PanelState } from "../../../models/panel";

import { ExpandButton } from "../../../features/MosaicDashboard/buttons/ExpandButton";
import { RemoveButton } from "../../../features/MosaicDashboard/buttons/RemoveButton";
import { dashboardStore } from "../../../stores/DashboardStore";

import { DashboardPath, DashboardWindow } from "../types";
import { OptionsButton } from "../internal/OptionsButton";

import { DashboardExpandoPanel } from "./DashboardExpandoPanel";
import { DashboardFitPanel } from "./DashboardFitPanel";
import { DashboardTabbedPanel } from "./DashboardTabbedPanel";

export interface DashboardPanelProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

const _DashboardPanel: React.FC<DashboardPanelProps> = ({ panel, path }) => {
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    const toolbarControls = (
        <>
            {!isLocked && <OptionsButton panel={panel} path={path} />}
            <ExpandButton />
            {!isLocked && <RemoveButton />}
        </>
    );

    return (
        <DashboardWindow
            className={styles.dashboardWindow}
            path={path}
            title={panel.title}
            toolbarControls={toolbarControls}
        >
            {createPanel(panel)}
        </DashboardWindow>
    );
};

export const DashboardPanel = React.memo(
    _DashboardPanel,
    (prevProps, nextProps) => prevProps.panel === nextProps.panel && isEqual(prevProps.path, nextProps.path)
);

function createPanel(panel: Panel<PanelState>): ReactNode {
    if (isTabbedPanel(panel)) {
        return <DashboardTabbedPanel panel={panel} />;
    } else if (isFitPanel(panel)) {
        return <DashboardFitPanel panel={panel} />;
    } else if (isExpandoPanel(panel)) {
        return <DashboardExpandoPanel panel={panel} />;
    } else {
        return (
            <div>
                <div>{panel.id}</div>
                <div>{panel.type}</div>
            </div>
        );
    }
}

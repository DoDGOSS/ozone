import styles from "./DashboardPanel.scss";

import React, { ReactNode, useCallback } from "react";
import { useBehavior } from "../../../hooks";
import { isEqual } from "lodash";

import { isExpandoPanel, isFitPanel, isTabbedPanel, Panel, PanelState } from "../../../models/panel";

import { ExpandButton } from "../../../features/MosaicDashboard/buttons/ExpandButton";
import { RemoveButton } from "../../../features/MosaicDashboard/buttons/RemoveButton";
import { dashboardStore } from "../../../stores/DashboardStore";

import { DashboardPath, DashboardWindow } from "../types";
import { EditableText } from "../internal/EditableText";
import { OptionsButton } from "../internal/OptionsButton";

import { DashboardExpandoPanel } from "./DashboardExpandoPanel";
import { DashboardFitPanel } from "./DashboardFitPanel";
import { DashboardTabbedPanel } from "./DashboardTabbedPanel";
import { dashboardService } from "../../../services/DashboardService";

export interface DashboardPanelProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

const _DashboardPanel: React.FC<DashboardPanelProps> = ({ panel, path }) => {
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    const { title: panelTitle } = useBehavior(panel.state);

    const toolbarControls = (
        <>
            {!isLocked && <OptionsButton panel={panel} path={path} />}
            <ExpandButton />
            {!isLocked && <RemoveButton />}
        </>
    );

    const setPanelTitle = useCallback((newTitle: string) => dashboardService.setPanelTitle(panel, newTitle), [panel]);

    const titleElement = <EditableText value={panelTitle} disabled={isLocked} onChange={setPanelTitle} />;

    return (
        <DashboardWindow
            className={styles.dashboardWindow}
            path={path}
            title={panelTitle}
            titleClassname={styles.windowTitle}
            titleElement={titleElement}
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

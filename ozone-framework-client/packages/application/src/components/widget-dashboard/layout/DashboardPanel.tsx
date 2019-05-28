import * as styles from "./DashboardPanel.scss";

import React, { ReactNode } from "react";

import { isExpandoPanel, isFitPanel, isTabbedPanel, Panel, PanelState } from "../../../models/panel";
import { DashboardPath, DashboardWindow } from "../types";

import { DashboardTabbedPanel } from "./DashboardTabbedPanel";
import { DashboardFitPanel } from "./DashboardFitPanel";
import { DashboardExpandoPanel } from "./DashboardExpandoPanel";
import { createWidgetToolbar } from "../toolbar";

import { isEqual } from "lodash";
import { classNames } from "../../../utility";

export interface DashboardPanelProps {
    panel: Panel<PanelState>;
    path: DashboardPath;
}

const _DashboardPanel: React.FC<DashboardPanelProps> = ({ panel, path }) => {
    return (
        <DashboardWindow
            className={classNames(styles.dashboardWindow, { "-tabbed": isTabbedPanel(panel) })}
            path={path}
            title={panel.title}
            toolbarControls={createWidgetToolbar(panel, path)}
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

import React from "react";
import { useBehavior } from "../../hooks";

import { Mosaic, MosaicBranch, MosaicWindow } from "react-mosaic-component";

import { PropsBase } from "../../common";
import { DashboardNode } from "../../stores/interfaces";

import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

const DashboardLayout = Mosaic.ofType<string>();
const DashboardWindow = MosaicWindow.ofType<string>();

export const WidgetDashboard: React.FunctionComponent<PropsBase> = (props) => {
    const { className } = props;

    const themeClass = useBehavior(mainStore.themeClass);
    const dashboard = useBehavior(dashboardStore.dashboard);

    const widgets = (dashboard && dashboard.widgets) || {};

    return (
        <div className={classNames(styles.dashboard, className)}>
            <DashboardLayout
                className={classNames("mosaic-blueprint-theme", "mosaic", "mosaic-drop-target", themeClass)}
                value={dashboard && dashboard.layout}
                onChange={(currentNode: DashboardNode | null) => {
                    dashboardStore.setLayout(currentNode);
                }}
                renderTile={(id: string, path: MosaicBranch[]) => {
                    const widget = widgets[id];
                    if (!widget) {
                        return (
                            <DashboardWindow title="Error" path={path}>
                                <h1>Error: Widget not found </h1>
                            </DashboardWindow>
                        );
                    }

                    const widgetDef = widget.definition;
                    return (
                        <DashboardWindow title={widgetDef.title} path={path}>
                            {widgetDef.element}
                        </DashboardWindow>
                    );
                }}
            />
        </div>
    );
};

import React from "react";
import { useBehavior } from "../../hooks";

import { Mosaic, MosaicBranch, MosaicWindow } from "react-mosaic-component";

import { PropsBase } from "../../common";
import { DashboardNode, Widget } from "../../stores/interfaces";

import { dashboardService } from "../../stores/DashboardService";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

const DashboardLayout = Mosaic.ofType<string>();
const DashboardWindow = MosaicWindow.ofType<string>();

export const WidgetDashboard: React.FC<PropsBase> = (props) => {
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
                    dashboardService.setLayout(currentNode);
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
                        <DashboardWindow title={widgetDef.title} path={path} className={styles.dashboardWindow}>
                            {widgetDef.url !== undefined ? (
                                <WidgetFrame widget={widget} />
                            ) : widgetDef.element !== undefined ? (
                                widgetDef.element
                            ) : (
                                "Error: Widget must have either a URL or an Element property"
                            )}
                        </DashboardWindow>
                    );
                }}
            />
        </div>
    );
};

interface WidgetFrameProps {
    widget: Widget;
}

const WidgetFrame: React.FC<WidgetFrameProps> = ({ widget }) => {
    const def = widget.definition;

    const id = widget.id;
    const nameJson = JSON.stringify({
        id,
        guid: def.id,
        url: def.url,
        owf: true,
        version: "1.0",
        containerVersion: "7.15.1",
        locked: false,
        layout: "tabbed",
        webContextPath: "/",
        preferenceLocation: "http://localhost:8080/prefs",
        relayUrl: "http://localhost:3000/rpc_relay.uncompressed.html",
        lang: "en_US",
        currentTheme: {
            themeName: "a_default",
            themeContrast: "standard",
            themeFontSize: 12
        }
    });

    return <iframe className={styles.widgetFrame} src={def.url} id={`widget-${widget.id}`} name={nameJson} />;
};

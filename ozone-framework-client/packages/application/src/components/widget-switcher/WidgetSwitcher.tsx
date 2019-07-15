import styles from "./index.module.scss";

import React, { useMemo } from "react";
import { Classes, Dialog } from "@blueprintjs/core";

import { useBehavior } from "../../hooks";
import { mainStore } from "../../stores/MainStore";
import { dashboardStore } from "../../stores/DashboardStore";
import { WidgetInstance } from "../../models/WidgetInstance";
import { classNames } from "../../utility";

import { WidgetTile } from "../admin-tools-dialog/WidgetTile";

export const WidgetSwitcher: React.FC = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isWidgetSwitcherVisible);

    const widgets = useCurrentDashboardWidgets();

    return (
        <Dialog
            className={classNames(styles.dialog, themeClass)}
            isOpen={isOpen}
            onClose={mainStore.hideWidgetSwitcher}
            title="Widget Switcher"
            icon="widget"
        >
            <div className={Classes.DIALOG_BODY}>
                {widgets.length === 0 ? (
                    <div className={styles.zeroState}>No widgets are running.</div>
                ) : (
                    <div className={styles.tileContainer}>
                        {widgets.map((widget) => (
                            <WidgetTile
                                key={widget.id}
                                title={widget.userWidget.title}
                                iconUrl={widget.userWidget.widget.images.largeUrl}
                                onClick={() => {
                                    /* TODO */
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Dialog>
    );
};

function useCurrentDashboardWidgets(): WidgetInstance[] {
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const dashboardState = useBehavior(dashboard.state);

    return useMemo(() => dashboard.getWidgets(), [dashboardState]);
}

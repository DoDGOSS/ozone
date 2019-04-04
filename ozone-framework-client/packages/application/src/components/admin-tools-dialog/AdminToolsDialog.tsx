import * as styles from "./index.scss";

import * as React from "react";
import { useMemo } from "react";
import { useBehavior, useBehavior2 } from "../../hooks";

import { values } from "lodash";

import { Classes, Dialog } from "@blueprintjs/core";

import { dashboardStore } from "../../stores/DashboardStore";
import { UserWidget } from "../../models/UserWidget";
import { UserDashboardsState } from "../../codecs/Dashboard.codec";

import { dashboardService } from "../../stores/DashboardService";
import { mainStore } from "../../stores/MainStore";

import { WidgetTile } from "./WidgetTile";

import { classNames, some } from "../../utility";

export const AdminToolsDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isAdminToolsDialogOpen);

    const userDashboards = useBehavior2(dashboardStore.userDashboards);
    const adminWidgets = useAdminWidgets(userDashboards);

    return (
        <div>
            <Dialog
                className={classNames(styles.dialog, themeClass)}
                isOpen={isOpen}
                onClose={mainStore.hideAdminToolsDialog}
                title="Administration"
                icon="wrench"
            >
                <div data-element-id="administration" className={Classes.DIALOG_BODY}>
                    <div className={styles.tileContainer}>
                        {adminWidgets.map((userWidget) => (
                            <WidgetTile
                                key={userWidget.id}
                                title={userWidget.widget.title}
                                iconUrl={userWidget.widget.images.largeUrl}
                                onClick={() => {
                                    dashboardService.addWidget(userWidget);
                                    mainStore.hideAdminToolsDialog();
                                }}
                            />
                        ))}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

function useAdminWidgets(state: UserDashboardsState): UserWidget[] {
    return useMemo(() => values(state.widgets).filter(isAdminWidget), [state]);
}

function isAdminWidget(userWidget: UserWidget): boolean {
    return some(userWidget.widget.types, (widgetType) => widgetType.name === "administration");
}

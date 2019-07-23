import styles from "./index.scss";

import React, { useMemo } from "react";
import { values } from "lodash";

import { Classes, Dialog } from "@blueprintjs/core";

import { UserState } from "../../codecs/Dashboard.codec";
import { useBehavior } from "../../hooks";
import { UserWidget } from "../../models/UserWidget";
import { dashboardService } from "../../services/DashboardService";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";
import { classNames, some } from "../../utility";

import { UserWidgetTile } from "../widget-tile";

export const AdminToolsDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isAdminToolsDialogOpen);

    const userDashboards = useBehavior(dashboardStore.userDashboards);
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
                            <UserWidgetTile
                                key={userWidget.id}
                                userWidget={userWidget}
                                onClick={() => {
                                    dashboardService.addWidget({ widget: userWidget });
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

function useAdminWidgets(state: UserState): UserWidget[] {
    return useMemo(() => values(state.widgets).filter(isAdminWidget), [state]);
}

function isAdminWidget(userWidget: UserWidget): boolean {
    return some(userWidget.widget.types, (widgetType) => widgetType.name === "administration");
}

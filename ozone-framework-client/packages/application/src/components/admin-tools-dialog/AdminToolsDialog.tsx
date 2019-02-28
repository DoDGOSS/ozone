import * as React from "react";
import { useBehavior } from "../../hooks";

import { Classes, Dialog } from "@blueprintjs/core";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";
import { widgetStore } from "../../stores/WidgetStore";

import { WidgetTile } from "./WidgetTile";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

export const AdminToolsDialog: React.FunctionComponent<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isAdminToolsDialogOpen);

    const adminWidgets = useBehavior(widgetStore.adminWidgets);

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
                        {adminWidgets.map((widget) => (
                            <WidgetTile
                                key={widget.id}
                                title={widget.title}
                                iconUrl={widget.iconUrl}
                                onClick={() => {
                                    dashboardStore.addWidget({
                                        id: widget.id,
                                        definition: widget.definition
                                    });
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

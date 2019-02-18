import * as React from "react";
import { useBehavior } from "../../hooks";

import { Classes, Dialog } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { CreateDashboardForm } from "./CreateDashboardForm";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

export const CreateDashboardDialog: React.FunctionComponent<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isCreateDashboardDialogVisible);

    const submitDashboard = () => {
        mainStore.hideCreateDashboardDialog();
    };

    return (
        <div>
            <Dialog
                className={classNames(themeClass, styles.dialog)}
                isOpen={isVisible}
                onClose={mainStore.hideCreateDashboardDialog}
                title="Create New Dashboard"
            >
                <div data-element-id="CreateDashboardDialog" className={Classes.DIALOG_BODY}>
                    <CreateDashboardForm onSubmit={submitDashboard} />
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                </div>
            </Dialog>
        </div>
    );
};

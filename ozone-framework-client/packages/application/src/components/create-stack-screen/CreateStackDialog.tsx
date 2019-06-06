import * as React from "react";
import { useBehavior } from "../../hooks";

import { Classes, Dialog } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { CreateStackForm } from "./CreateStackForm";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

export const CreateStackDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isCreateStackDialogVisible);

    const onSubmit = () => {
        mainStore.hideCreateStackDialog();
        mainStore.showStackDialog();
    };

    return (
        <div>
            <Dialog
                className={classNames(themeClass, styles.dialog)}
                isOpen={isVisible}
                onClose={onSubmit}
                title="Create New Stack"
            >
                <div data-element-id="CreateStackDialog" className={Classes.DIALOG_BODY}>
                    <CreateStackForm onSubmit={onSubmit} />
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                </div>
            </Dialog>
        </div>
    );
};

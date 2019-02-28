import * as React from "react";
import { useBehavior } from "../../hooks";

import { Classes, Dialog } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

export const HelpDialog: React.FunctionComponent = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isHelpDialogVisible);

    return (
        <Dialog
            className={classNames(themeClass, styles.helpDialog)}
            title="Help"
            icon="help"
            isOpen={isOpen}
            onClose={mainStore.hideHelpDialog}
        >
            <div className={classNames(Classes.DIALOG_BODY, styles.helpContent)}>
                <p>Lorem ipsum...</p>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS} />
            </div>
        </Dialog>
    );
};

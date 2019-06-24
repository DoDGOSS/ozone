import styles from "./index.module.scss";

import React from "react";
import { AnchorButton, Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../utility";
import { Intent } from "@blueprintjs/core/lib/esm/common/intent";

export interface RedirectDialogProps {
    isOpen: boolean;
    nextUrl: string;
}

export const RedirectDialog: React.FC<RedirectDialogProps> = (props) => {
    return (
        <Dialog
            className={classNames("bp3-dark", styles.dialog)}
            title="Login Success"
            icon="log-in"
            isOpen={props.isOpen}
            isCloseButtonShown={false}
        >
            <div className={classNames(Classes.DIALOG_BODY, styles.body)} data-test-id="redirect-dialog">
                <div className={styles.form}>
                    <AnchorButton href={props.nextUrl} text={"Continue to Desktop"} intent={Intent.SUCCESS} />
                </div>
            </div>
        </Dialog>
    );
};

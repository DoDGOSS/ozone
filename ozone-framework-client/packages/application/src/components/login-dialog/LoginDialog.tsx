import * as React from "react";
import { useBehavior } from "../../hooks";

import { Classes, Dialog } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { LoginForm } from "./LoginForm";

import { classNames } from "../../utility";

import * as styles from "./LoginDialog.scss";

export const LoginDialog: React.FC<{}> = () => {
    const isOpen = useBehavior(mainStore.isLoginDialogOpen);

    return (
        <div>
            <Dialog className={classNames("bp3-dark", styles.dialog)} isOpen={isOpen} title="Login" icon="log-in">
                <div className={classNames(Classes.DIALOG_BODY, styles.dialogBody)} data-element-id="login-dialog">
                    <div className={styles.tileContainer}>
                        <LoginForm
                            onSuccess={() => {
                                mainStore.hideLoginDialog();
                            }}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

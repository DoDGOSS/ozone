import styles from "./index.module.scss";

import React from "react";

import { Classes, Dialog } from "@blueprintjs/core";

import { LoginForm } from "./LoginForm";

import { classNames } from "../../utility";

export interface LoginDialogProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = (props) => (
    <Dialog className={classNames("bp3-dark", styles.dialog)} title="Login" icon="log-in" isOpen={props.isOpen}>
        <div className={classNames(Classes.DIALOG_BODY, styles.body)} data-element-id="login-dialog">
            <div className={styles.flexVertical}>
                <LoginForm onSuccess={props.onSuccess} />
            </div>
        </div>
    </Dialog>
);

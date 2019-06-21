import styles from "./index.module.scss";

import React, { useMemo } from "react";

import { Callout, Classes, Dialog, Intent } from "@blueprintjs/core";

import { LoginForm } from "./LoginForm";

import { classNames } from "../../utility";

export interface LoginDialogProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = (props) => (
    <Dialog
        className={classNames("bp3-dark", styles.dialog)}
        title="Login"
        icon="log-in"
        isOpen={props.isOpen}
        isCloseButtonShown={false}
    >
        <div className={classNames(Classes.DIALOG_BODY, styles.body)} data-test-id="login-dialog">
            <AuthStatusCallout />
            <LoginForm onSuccess={props.onSuccess} />
        </div>
    </Dialog>
);

const AuthStatusCallout: React.FC = () => {
    const params = useSearchParams();

    if (params.has("out")) {
        return <Callout className={styles.status} intent={Intent.SUCCESS} title="Logged Out" />;
    }
    if (params.has("error")) {
        return <Callout className={styles.status} intent={Intent.DANGER} title="Invalid Username or Password" />;
    }
    if (params.has("invalid")) {
        return (
            <Callout className={styles.status} intent={Intent.DANGER} title="Session Invalid - please login again" />
        );
    }
    if (params.has("time")) {
        return (
            <Callout className={styles.status} intent={Intent.DANGER} title="Session Timed Out - please login again" />
        );
    }

    return null;
};

export function useSearchParams(): URLSearchParams {
    return useMemo(() => new URLSearchParams(window.location.search), []);
}

import * as React from "react";
import { useEffect } from "react";

import { WarningDialog } from "../warning-screen/WarningDialog";
import { LoginDialog } from "./LoginDialog";
import { UserAgreement } from "../warning-screen/UserAgreement";
import { mainStore } from "../../stores/MainStore";

import * as styles from "./index.scss";

export const LoginScreen: React.FunctionComponent<{}> = () => {
    useEffect(() => {
        mainStore.showWarningDialog();
    }, []);

    return (
        <div className={styles.loginScreen}>
            <LoginDialog />
            <WarningDialog />
            <UserAgreement />
        </div>
    );
};

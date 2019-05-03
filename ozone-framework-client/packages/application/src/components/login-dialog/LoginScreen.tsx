import * as React from "react";
import { useEffect } from "react";

import { LoginDialog } from "./LoginDialog";
import { mainStore } from "../../stores/MainStore";

import * as styles from "./index.scss";

export const LoginScreen: React.FC<{}> = () => {
    useEffect(() => {
        mainStore.showLoginDialog()
    }, []);

    return (
        <div className={styles.loginScreen}>
            <LoginDialog />
        </div>
    );
};

import styles from "./index.module.scss";

import React, { useEffect, useMemo } from "react";
import { useBehavior } from "../../hooks";

import { Spinner } from "@blueprintjs/core";

import { AuthStatus, authStore } from "../../stores/AuthStore";

import { HomeScreen } from "../../components/home-screen/HomeScreen";
import { ClassificationWrapper } from "../../components/classification/ClassificationWrapper";

import { env } from "../../environment";

export const MainPage: React.FC<{}> = () => {
    const loginOpts = useMemo(() => env().login, []);

    const authStatus = useBehavior(authStore.status);

    useEffect(() => {
        authStore.check();
    }, []);

    useEffect(() => {
        // TODO: Fallback if logged out and login screen is disabled
        if (authStatus === AuthStatus.LOGGED_OUT && loginOpts.isEnabled) {
            window.open(loginOpts.loginUrl, "_self");
        }
    }, [authStatus]);

    return (
        <ClassificationWrapper>
            {authStatus === AuthStatus.PENDING && <Spinner className={styles.loadingSpinner} />}
            {authStatus === AuthStatus.LOGGED_IN && <HomeScreen />}
        </ClassificationWrapper>
    );
};

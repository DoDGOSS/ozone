import styles from "./index.module.scss";

import React, { useEffect, useMemo } from "react";
import { useBehavior } from "../../hooks";

import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { Spinner } from "@blueprintjs/core";

import { env } from "../../environment";
import { AuthStatus, authStore } from "../../stores/AuthStore";
import { dashboardStore } from "../../stores/DashboardStore";

import { HomeScreen } from "../../components/home-screen/HomeScreen";
import { ClassificationWrapper } from "../../components/classification/ClassificationWrapper";

import { asInteger, clampMinimum, isNil } from "../../utility";
import { systemConfigStore } from "../../stores/SystemConfigStore";
import { DEFAULT_AUTO_SAVE_INTERVAL, MINIMUM_AUTO_SAVE_INTERVAL } from "../../constants";

export const MainPage: React.FC<{}> = () => {
    const loginOpts = useMemo(() => env().login, []);

    const authStatus = useBehavior(authStore.status);

    useEffect(() => {
        authStore.check();
    }, []);

    useEffect(() => {
        systemConfigStore.fetchConfigs();
    }, []);

    // Redirect to login if required
    useEffect(() => {
        // TODO: Fallback if logged out and login screen is disabled
        if (authStatus === AuthStatus.LOGGED_OUT && loginOpts.isEnabled) {
            window.open(loginOpts.loginUrl, "_self");
        }
    }, [authStatus]);

    // Timer for auto-saving Dashboards
    useEffect(() => {
        if (authStatus !== AuthStatus.LOGGED_IN) return;

        const autoSaveSetting = asInteger(env().autoSaveInterval, DEFAULT_AUTO_SAVE_INTERVAL);
        const autoSaveInterval = clampMinimum(autoSaveSetting, MINIMUM_AUTO_SAVE_INTERVAL);

        const timer = window.setInterval(dashboardStore.saveCurrentDashboard, autoSaveInterval);
        return () => {
            if (!isNil(timer)) window.clearInterval(timer);
        };
    }, [authStatus]);

    return (
        <DragDropContextProvider backend={HTML5Backend}>
            <ClassificationWrapper>
                {authStatus === AuthStatus.PENDING && <Spinner className={styles.loadingSpinner} />}
                {authStatus === AuthStatus.LOGGED_IN && <HomeScreen />}
            </ClassificationWrapper>
        </DragDropContextProvider>
    );
};

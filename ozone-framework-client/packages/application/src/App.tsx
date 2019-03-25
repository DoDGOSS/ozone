import * as React from "react";
import { useEffect } from "react";
import { useBehavior } from "./hooks";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { Spinner } from "@blueprintjs/core";

import { AuthStatus, authStore } from "./stores/AuthStore";
import { HomeScreen } from "./components/home-screen/HomeScreen";
import { LoginScreen } from "./components/login-dialog/LoginScreen";
import { ClassificationWrapper } from "./components/classification/ClassificationWrapper";

import * as styles from "./App.scss";

export const Paths = {
    HOME: "/",
    LOGIN: "/"
};

export const App: React.FC<{}> = () => {
    const authStatus = useBehavior(authStore.status);

    useEffect(() => {
        authStore.check();
    }, []);

    return (
        <Router>
            <ClassificationWrapper>
                {authStatus === AuthStatus.PENDING && <Spinner className={styles.loadingSpinner} />}
                {authStatus === AuthStatus.LOGGED_OUT && <Route exact path={Paths.LOGIN} component={LoginScreen} />}
                {authStatus === AuthStatus.LOGGED_IN && <Route exact path={Paths.HOME} component={HomeScreen} />}
            </ClassificationWrapper>
        </Router>
    );
};

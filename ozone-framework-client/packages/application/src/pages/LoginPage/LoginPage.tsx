import styles from "./index.module.scss";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { authService } from "../../services/AuthService";

import { LoginDialog, RedirectDialog } from "../../features/Login";

import { env } from "./environment";

export const LoginPage: React.FC<{}> = () => {
    const loginOpts = useMemo(() => env().login, []);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const redirectToDesktop = useCallback(() => {
        window.open(loginOpts.nextUrl, "_self");
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        authService
            .check()
            .then(() => {
                redirectToDesktop();
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <div data-test-id="login-page" className={styles.root}>
            <LoginDialog isOpen={!isAuthenticated} onSuccess={redirectToDesktop} />
            <RedirectDialog isOpen={isAuthenticated} nextUrl={loginOpts.nextUrl} />
        </div>
    );
};

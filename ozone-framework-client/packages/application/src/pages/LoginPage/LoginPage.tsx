import styles from "./index.module.scss";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Spinner } from "@blueprintjs/core";

import { authService } from "../../services/AuthService";

import { LoginDialog, RedirectDialog, useSearchParams } from "../../features/Login";
import { ConsentNotice } from "../../features/ConsentNotice";
import { UserAgreement } from "../../features/UserAgreement";

import { env } from "../../environment";

enum LoginState {
    Loading,
    Consent,
    UserAgreement,
    Login,
    Redirect
}

export const LoginPage: React.FC<{}> = () => {
    const loginOpts = useMemo(() => env().login, []);
    const consentOpts = useMemo(() => env().consentNotice, []);
    const agreementsOpts = useMemo(() => env().userAgreement, []);

    const params = useSearchParams();
    const showLogin = useMemo(() => hasStatusParam(params), [params]);

    const [state, setState] = useState<LoginState>(showLogin ? LoginState.Login : LoginState.Loading);

    const redirectToDesktop = useCallback(() => {
        window.open(loginOpts.nextUrl, "_self");
        setState(LoginState.Redirect);
    }, []);

    useEffect(() => {
        if (showLogin) return;

        const isConsentEnabled = consentOpts.isEnabled !== false;

        authService
            .check()
            .then(() => redirectToDesktop())
            .catch(() => setState(isConsentEnabled ? LoginState.Consent : LoginState.Login));
    }, []);

    return (
        <div data-test-id="login-page" className={styles.root}>
            {state === LoginState.Loading && <Spinner className={styles.loadingSpinner} />}

            <ConsentNotice
                opts={consentOpts}
                isOpen={state === LoginState.Consent}
                showUserAgreement={() => setState(LoginState.UserAgreement)}
                onAccept={() => setState(LoginState.Login)}
            />

            <UserAgreement
                opts={agreementsOpts}
                isOpen={state === LoginState.UserAgreement}
                onClose={() => setState(LoginState.Consent)}
            />

            <LoginDialog isOpen={state === LoginState.Login} onSuccess={redirectToDesktop} />

            <RedirectDialog isOpen={state === LoginState.Redirect} nextUrl={loginOpts.nextUrl} />
        </div>
    );
};

function hasStatusParam(params: URLSearchParams): boolean {
    return params.has("out") || params.has("error") || params.has("invalid") || params.has("time");
}

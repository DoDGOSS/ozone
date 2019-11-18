import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { Gateway, getGateway } from "../api/interfaces";
import { AuthUserDTO } from "../api/models/AuthUserDTO";
import { AuthenticationError } from "../api/errors";
import { logoutUrl } from "../environment";
import { isNil } from "../utility";

import { mainStore } from "./MainStore";

export enum AuthStatus {
    PENDING,
    LOGGED_IN,
    LOGGED_OUT
}

export class AuthStore {
    private readonly gateway: Gateway;

    private readonly status$ = new BehaviorSubject(AuthStatus.PENDING);
    private readonly user$ = new BehaviorSubject<AuthUserDTO | null>(null);

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    user = () => asBehavior(this.user$);
    status = () => asBehavior(this.status$);

    logout = () => {
        this.gateway
            .logout()
            .then(() => {
                window.open(logoutUrl(), "_self");
            })
            .catch(() => {
                // TODO: Error handling
            });
    };

    check = () => {
        this.gateway
            .getLoginStatus()
            .then((result) => {
                this.onAuthenticateSuccess(result.data);
            })
            .catch(this.onAuthenticationFailure);
    };

    private onAuthenticateSuccess = (user: AuthUserDTO) => {
        mainStore.setTheme(user.theme);
        this.user$.next(user);
        this.status$.next(AuthStatus.LOGGED_IN);
    };

    private onAuthenticationFailure = (ex: Error) => {
        this.user$.next(null);
        this.status$.next(AuthStatus.LOGGED_OUT);
        if (!isUnauthorized(ex)) {
            console.error(`Authentication failure: ${ex}`);
        }
    };
}

function isUnauthorized(error: Error): boolean {
    return error instanceof AuthenticationError && !isNil(error.cause.response) && error.cause.response.status === 401;
}

export const authStore = new AuthStore();

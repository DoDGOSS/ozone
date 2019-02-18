import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { Gateway, getGateway } from "../api/interfaces";

import { AuthUserDTO } from "../api/models/AuthUserDTO";

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

    login = async (username: string, password: string) => {
        try {
            const user = (await this.gateway.login(username, password)).data;
            this.onAuthenticateSuccess(user);
            return true;
        } catch (ex) {
            this.onAuthenticationFailure(ex);
            return false;
        }
    };

    logout = () => {
        this.gateway
            .logout()
            .then(() => {
                location.reload();
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
            .catch((error) => {
                this.onAuthenticationFailure(error);
            });
    };

    private onAuthenticateSuccess = (user: AuthUserDTO) => {
        this.user$.next(user);
        this.status$.next(AuthStatus.LOGGED_IN);
    };

    private onAuthenticationFailure = (ex: Error) => {
        this.user$.next(null);
        this.status$.next(AuthStatus.LOGGED_OUT);
        console.log("Authentication failure");
        console.dir(ex);
    };
}

export const authStore = new AuthStore();

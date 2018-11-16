import { action, observable, runInAction } from "mobx";

import { injectable, lazyInject, TYPES } from "../inject";

import { Gateway } from "../api";
import { AuthUserDTO } from "../api/auth";


@injectable()
export class AuthStore {

    @observable
    isAuthenticated: boolean | "pending";

    @observable
    user?: AuthUserDTO;

    @observable
    error?: string;

    @lazyInject(TYPES.Gateway)
    private gateway: Gateway;

    constructor() {
        runInAction("initialize", () => {
            this.isAuthenticated = "pending";
            this.error = undefined;
        });
    }

    @action.bound
    async login(username: string, password: string): Promise<boolean> {
        try {
            const user = (await this.gateway.login(username, password)).data;
            this.onAuthenticateSuccess(user);
            return true;
        } catch (ex) {
            this.onAuthenticationFailure(ex);
            return false;
        }
    }

    @action.bound
    async check(): Promise<void> {
        try {
            const user = (await this.gateway.getLoginStatus()).data;
            this.onAuthenticateSuccess(user);
        } catch (ex) {
            this.onAuthenticationFailure(ex);
        }
    }

    @action.bound
    onAuthenticateSuccess(user: AuthUserDTO) {
        this.user = user;
        this.isAuthenticated = true;
        this.error = undefined;
    }

    @action.bound
    onAuthenticationFailure(ex: Error) {
        this.user = undefined;
        this.isAuthenticated = false;
        this.error = ex.message;
    }

}

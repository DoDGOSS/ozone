import { action, observable, runInAction } from "mobx";

import { inject, injectable } from "../inject";
import { OzoneGateway } from "../api";
import { User } from "../models";


@injectable()
export class AuthStore {

    @observable
    isAuthenticated: boolean | "pending";

    @observable
    user?: User;

    @observable
    error?: string;

    @inject(OzoneGateway)
    private gateway: OzoneGateway;

    constructor() {
        runInAction("initialize", () => {
            this.isAuthenticated = "pending";
            this.error = undefined;
        });
    }

    @action.bound
    async check() {
        try {
            const user = (await this.gateway.fetchUserStatus()).data;
            runInAction("checkSuccess", () => {
                this.user = user;
                this.isAuthenticated = true;
                this.error = undefined;
            });
        } catch (ex) {
            runInAction("checkFailure", () => {
                this.user = undefined;
                this.isAuthenticated = false;
                this.error = ex.message;
            });
        }
    }

    @action.bound
    async login(username: string, password: string): Promise<boolean> {
        try {
            await this.gateway.login(username, password);
            await runInAction("loginSuccess", this.check);
            return true;
        } catch (ex) {
            runInAction("loginFailure", () => {
                console.log("AuthStore/loginFailure");
                this.isAuthenticated = false;
                this.error = ex.message;
            });
            return false;
        }
    }

}

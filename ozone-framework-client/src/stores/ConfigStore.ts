import { action, computed, observable, runInAction } from "mobx";

import { inject, injectable } from "../inject";

import { ConfigService } from "../services";
import { OzoneConfig, User } from "../api";


@injectable()
export class ConfigStore {

    @observable
    config?: OzoneConfig;

    @observable
    user?: User;

    @inject(ConfigService)
    private configService: ConfigService;

    @computed
    get userDisplayName() {
        return (this.user && this.user.userRealName)
            ? this.user.userRealName
            : "Unknown User";
    }

    @action.bound
    async fetch() {
        const config = await this.configService.getConfig();

        runInAction("fetchSuccess", () => {
            this.config = config;
            this.user = config.user;
        });
    }

}

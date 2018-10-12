import { computed, observable } from "mobx";

import { inject, injectable } from "../inject";

import { ConfigService } from "../services";
import { OzoneConfig, User } from "../api";


@injectable()
export class ConfigStore {

    @observable
    public config?: OzoneConfig;

    @observable
    public user?: User;

    @inject(ConfigService)
    private configService: ConfigService;

    @computed get userDisplayName() {
        return (this.user && this.user.userRealName)
            ? this.user.userRealName
            : "Unknown User";
    }

    public fetch() {
        this.configService.getConfig().then(config => {
            this.config = config;
            this.user = config.user;
        });
    }

}

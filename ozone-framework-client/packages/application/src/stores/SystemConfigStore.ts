import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { ConfigDTO } from "../api/models/ConfigDTO";
import { SystemConfigAPI, systemConfigApi as configApiDefault } from "../api/clients/SystemConfigAPI";

export class SystemConfigStore {
    private readonly configs$ = new BehaviorSubject<ConfigDTO[]>([]);

    private readonly configApi: SystemConfigAPI;

    constructor(configApi?: SystemConfigAPI) {
        this.configApi = configApi || configApiDefault;
    }

    configs = () => asBehavior(this.configs$);

    fetch = async () => {
        const results = await this.configApi.getConfigs();
        if (results.status !== 200) {
            // TODO: Error handling?
            this.configs$.next([]);
        } else {
            this.configs$.next(results.data);
        }
    };
}

export const systemConfigStore = new SystemConfigStore();

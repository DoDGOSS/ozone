import { BehaviorSubject } from "rxjs";

import { SystemConfigAPI, ConfigDTO } from "../api";

import { lazy } from "../utility";


export class SystemConfigStore {

    static readonly instance = lazy(() => new SystemConfigStore());

    readonly configs$ = new BehaviorSubject<ConfigDTO[]>([]);

    private readonly configApi: SystemConfigAPI;

    constructor(configApi?: SystemConfigAPI) {
        this.configApi = configApi || SystemConfigAPI.instance();
    }

    async fetch() {
        const results = await this.configApi.getConfigs();
        if (results.status !== 200) {
            // TODO: Error handling?
            this.configs$.next([]);
        } else {
            this.configs$.next(results.data);
        }
    }

}

import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { ConfigDTO } from "../api/models/ConfigDTO";
import { SystemConfigAPI, systemConfigApi as configApiDefault } from "../api/clients/SystemConfigAPI";

export class SystemConfigStore {
    private readonly configs$ = new BehaviorSubject<ConfigDTO[]>([]);
    private readonly backgroundImageConfig$ = new BehaviorSubject<ConfigDTO | null>(null);
    private readonly headerHeight$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly footerHeight$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly headerBody$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly footerBody$ = new BehaviorSubject<string | undefined>(undefined);

    private readonly configApi: SystemConfigAPI;

    constructor(configApi?: SystemConfigAPI) {
        this.configApi = configApi || configApiDefault;
    }

    configs = () => asBehavior(this.configs$);
    backgroundImageConfig = () => asBehavior(this.backgroundImageConfig$);
    headerHeight = () => asBehavior(this.headerHeight$);
    footerHeight = () => asBehavior(this.footerHeight$);
    headerBody = () => asBehavior(this.headerBody$);
    footerBody = () => asBehavior(this.footerBody$);

    fetchConfigs = async () => {
        return this.configApi.getConfigs().then(async (results) => {
            if (results.status !== 200) {
                // TODO: Error handling?
                this.configs$.next([]);
            } else {
                this.configs$.next(results.data);
                this.backgroundImageConfig$.next(
                    results.data.filter((config) => config.code === "owf.custom.background.url")[0]
                );
                this.headerHeight$.next(
                    results.data.filter((config) => config.code === "owf.custom.header.height")[0].value
                );
                this.footerHeight$.next(
                    results.data.filter((config) => config.code === "owf.custom.footer.height")[0].value
                );
                this.headerBody$.next(
                    await this.getBodyFromUrl(
                        results.data.filter((config) => config.code === "owf.custom.header.url")[0].value
                    )
                );
                this.footerBody$.next(
                    await this.getBodyFromUrl(
                        results.data.filter((config) => config.code === "owf.custom.footer.url")[0].value
                    )
                );
                this.includeCSS(results.data.filter((config) => config.code === "owf.custom.css")[0].value);
                this.includeJS(results.data.filter((config) => config.code === "owf.custom.jss")[0].value);
            }
        });
    };

    private async getBodyFromUrl(urlString: string | undefined) {
        if (urlString !== undefined) {
            const headResponse = await fetch(urlString);
            if (!headResponse.ok) {
                return;
            }
            return await headResponse.text();
        } else {
            return "";
        }
    }

    private includeJS(urlString: string | undefined) {
        if (urlString !== undefined && urlString !== null) {
            while (document.getElementById("custom-added-js")) {
                document.body.removeChild(document.getElementById("custom-added-js")!);
            }
            urlString.split(/\s*,\s*/).forEach((jsUrl) => {
                const scriptToAdd = document.createElement("script");
                scriptToAdd.src = jsUrl;
                scriptToAdd.id = "custom-added-js";
                document.body.appendChild(scriptToAdd);
            });
        }
    }

    private includeCSS(urlString: string | undefined) {
        if (urlString !== undefined && urlString !== null) {
            while (document.getElementById("custom-added-css")) {
                document.body.removeChild(document.getElementById("custom-added-css")!);
            }
            urlString.split(/\s*,\s*/).forEach((cssUrl) => {
                const cssToAdd = document.createElement("link");
                cssToAdd.href = cssUrl;
                cssToAdd.type = "text/css";
                cssToAdd.rel = "stylesheet";
                cssToAdd.id = "custom-added-css";
                document.body.appendChild(cssToAdd);
            });
        }
    }
}

export const systemConfigStore = new SystemConfigStore();

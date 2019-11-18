import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";
import { ConfigDTO } from "../api/models/ConfigDTO";
import { SystemConfigAPI, systemConfigApi as configApiDefault } from "../api/clients/SystemConfigAPI";
import { systemConfigFromJson } from "../codecs/SystemConfig.codec";
import { isBlank, isNil } from "../utility";
import { ListOf, Response } from "../api/interfaces";

const CUSTOM_JS_ID = "custom-added-js";
const CUSTOM_CSS_ID = "custom-added-css";

export class SystemConfigStore {
    private readonly configs$ = new BehaviorSubject<ConfigDTO[]>([]);

    private readonly backgroundImageConfig$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly headerHeight$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly headerBody$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly footerHeight$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly footerBody$ = new BehaviorSubject<string | undefined>(undefined);

    private readonly configApi: SystemConfigAPI;

    constructor(configApi?: SystemConfigAPI) {
        this.configApi = configApi || configApiDefault;
    }

    configs = () => asBehavior(this.configs$);

    backgroundImageUrl = () => asBehavior(this.backgroundImageConfig$);
    headerHeight = () => asBehavior(this.headerHeight$);
    headerBody = () => asBehavior(this.headerBody$);
    footerHeight = () => asBehavior(this.footerHeight$);
    footerBody = () => asBehavior(this.footerBody$);

    fetchConfigs = (): void => {
        this.configApi.getConfigs().then(this.updateConfigs);
    };

    private updateConfigs = (results: Response<ListOf<ConfigDTO[]>>): void => {
        // TODO: Error handling?
        if (!(results.status >= 200 && results.status < 400)) {
            this.configs$.next([]);
            return;
        }

        this.configs$.next(results.data.data);

        const sysConfig = systemConfigFromJson(results.data.data);

        this.backgroundImageConfig$.next(sysConfig.backgroundImageUrl);
        this.headerHeight$.next(sysConfig.headerHeight);
        this.footerHeight$.next(sysConfig.footerHeight);

        getBodyFromUrl(sysConfig.headerUrl).then((headerBody) => this.headerBody$.next(headerBody));

        getBodyFromUrl(sysConfig.footerUrl).then((footerBody) => this.footerBody$.next(footerBody));

        createCustomScriptElements(sysConfig.customJs);

        createCustomStylesheetElements(sysConfig.customCss);
    };
}

export const systemConfigStore = new SystemConfigStore();

async function getBodyFromUrl(url: string | undefined): Promise<string | undefined> {
    if (!url || isBlank(url)) return undefined;

    const response = await fetch(url);
    if (!response.ok) return undefined;

    const body = await response.text();
    if (isBlank(body)) return undefined;
    return body;
}

function createCustomScriptElements(urlString: string | undefined): void {
    if (isNil(urlString) || isBlank(urlString)) return;

    removeElementsById(CUSTOM_JS_ID);

    urlString.split(/\s*,\s*/).forEach((jsUrl) => {
        const scriptToAdd = document.createElement("script");
        scriptToAdd.src = jsUrl;
        scriptToAdd.id = CUSTOM_JS_ID;
        document.body.appendChild(scriptToAdd);
    });
}

function createCustomStylesheetElements(urlString: string | undefined): void {
    if (isNil(urlString) || isBlank(urlString)) return;

    removeElementsById(CUSTOM_CSS_ID);

    urlString.split(/\s*,\s*/).forEach((cssUrl) => {
        const cssToAdd = document.createElement("link");
        cssToAdd.href = cssUrl;
        cssToAdd.type = "text/css";
        cssToAdd.rel = "stylesheet";
        cssToAdd.id = CUSTOM_CSS_ID;
        document.body.appendChild(cssToAdd);
    });
}

function removeElementsById(id: string): void {
    while (true) {
        const element = document.getElementById(id);
        if (isNil(element)) break;

        document.body.removeChild(element);
    }
}

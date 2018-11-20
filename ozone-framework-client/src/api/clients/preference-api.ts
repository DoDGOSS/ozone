import { Gateway, Response } from "..";


export class PreferenceAPI {

    private readonly gateway: Gateway;

    constructor(gateway: Gateway) {
        this.gateway = gateway;
    }

    async getPreferences(namespace?: string): Promise<Response<any>> {
        if (namespace !== undefined) {
            return this.gateway.get(`prefs/preference/${namespace}/`);
        }

        return this.gateway.get("prefs/preference/");
    }

    async getPreference(namespace: string, path: string): Promise<Response<any>> {
        return this.gateway.get(`prefs/preference/${namespace}/${path}/`);
    }

    async getServerResources(): Promise<Response<any>> {
        return this.gateway.get(`prefs/server/resources/`);
    }

}

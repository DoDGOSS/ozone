
import {
	Gateway,
	getGateway,
	Response
} from "../interfaces";
import { PreferenceAPI } from './PreferenceAPI';
import { mainStore } from "../../stores/MainStore";

import { isBlank } from "../../utility";
import * as qs from "qs";

export class ThemeAPI {
    private readonly preferenceApi: PreferenceAPI;


    constructor(gateway?: Gateway) {
        if (gateway) {
            this.preferenceApi = new PreferenceAPI(gateway);
        }
        else {
            this.preferenceApi = new PreferenceAPI();
        }
    }

    private formatResponse(response: Response<any>): Response<any> {
        if (response.data && response.data.data && response.data.data.value !== undefined) {
            response.data = response.data.data.value;
        }
        else {
            response.data = "";
        }
        return response;
    }

    getTheme(): Promise<Response<any>> {
        return this.preferenceApi.getPreference('owf','selected_theme').then(
            (response) => this.formatResponse(response)
        );
    }

    async setTheme(newTheme: string): Promise<Response<any>> {
		// make sure no one's trying to use this css class to inject something nefarious.
		// Mixed claims about whether it's possible, but it doesn't hurt to check.
		// https://stackoverflow.com/questions/5855398/user-defined-css-what-can-go-wrong
		newTheme = isBlank(newTheme) ? "" : "bp3-dark";
        mainStore.setTheme(newTheme);
        return this.preferenceApi.updatePreference({namespace: 'owf', path: 'selected_theme', value: newTheme}).then(
            (response) => this.formatResponse(response)
        );
    }

    async toggle(): Promise<Response<any>> {
        return this.getTheme().then( response => {
            let newTheme: string = isBlank(response.data) ? "bp3-dark" : "";
            return this.setTheme(newTheme);
        });

    }
}

export const themeApi = new ThemeAPI();

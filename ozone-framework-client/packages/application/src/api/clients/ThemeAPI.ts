import { get } from "lodash";

import { Response } from "../interfaces";
import { preferenceApi, PreferenceAPI } from "./PreferenceAPI";

import { isBlank } from "../../utility";

import { DARK_THEME } from "../../constants";

export class ThemeAPI {
    private readonly preferenceApi: PreferenceAPI;

    constructor(api?: PreferenceAPI) {
        this.preferenceApi = api || preferenceApi;
    }

    getTheme(): Promise<Response<string>> {
        return this.preferenceApi.getPreference("owf", "selected_theme").then(formatResponseFromGet); // TODO: look at this in more detail. And possibly look into the default data.
    }

    async setTheme(newTheme: string): Promise<Response<string>> {
        // make sure no one is trying to use this css class to inject something nefarious.
        // Mixed claims about whether it's possible, but it doesn't hurt to check.
        // https://stackoverflow.com/questions/5855398/user-defined-css-what-can-go-wrong
        newTheme = isBlank(newTheme) ? "" : DARK_THEME;
        return this.preferenceApi
            .updatePreference({
                namespace: "owf",
                path: "selected_theme",
                value: newTheme
            })
            .then(formatResponseFromUpdate);
    }

    async toggle(): Promise<Response<any>> {
        return this.getTheme().then((response) => {
            const newTheme = isBlank(response.data) ? DARK_THEME : "";
            return this.setTheme(newTheme);
        });
    }
}

export const themeApi = new ThemeAPI();

function formatResponseFromGet(response: Response<any>): Response<string> {
    response.data = get(response, "data.preference.value", "");
    return response;
}

function formatResponseFromUpdate(response: Response<any>): Response<string> {
    response.data = get(response, "data.value", "");
    return response;
}

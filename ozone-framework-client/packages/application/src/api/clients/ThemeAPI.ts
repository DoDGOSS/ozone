import { get } from "lodash";

import { ListOf, Response } from "../interfaces";

import { isBlank, isNil } from "../../utility";

import { DARK_THEME } from "../../constants";
import { userPreferenceApi, UserPreferenceAPI } from "./PreferenceUserAPI";
import { PreferenceDTO } from "../models/PreferenceDTO";

export class ThemeAPI {
    private readonly preferenceApi: UserPreferenceAPI;
    private currentTheme: PreferenceDTO;

    constructor(api?: UserPreferenceAPI) {
        this.preferenceApi = api || userPreferenceApi;
    }

    getTheme(): Promise<string> {
        return this.getThemePreference().then((response: Response<ListOf<PreferenceDTO[]>>) => {
            return get(response.data, "data.value", "");
        });
    }

    async getThemePreference(): Promise<Response<ListOf<PreferenceDTO[]>>> {
        return this.preferenceApi
            .getPreference("owf", "selected_theme")
            .then((response: Response<ListOf<PreferenceDTO[]>>) => {
                this.currentTheme = response.data.data[0];
                return response;
            });
    }

    async setInitalTheme(theme: string = ""): Promise<Response<PreferenceDTO>> {
        return this.preferenceApi
            .createPreference({
                namespace: "owf",
                path: "selected_theme",
                value: theme
            })
            .then((response: Response<PreferenceDTO>) => {
                this.currentTheme = response.data;
                return response;
            });
    }

    async setTheme(newTheme: string): Promise<string | undefined> {
        // make sure no one is trying to use this css class to inject something nefarious.
        // Mixed claims about whether it's possible, but it doesn't hurt to check.
        // https://stackoverflow.com/questions/5855398/user-defined-css-what-can-go-wrong
        newTheme = isBlank(newTheme) ? "" : DARK_THEME;
        const themePreference: any = await this.getThemePreference();

        // theme does not exists in database, lets add one.
        if (themePreference.data.results <= 0) {
            return this.setInitalTheme(newTheme).then((response) => get(response, "data.value", ""));
        } else {
            if (this.currentTheme) {
                return this.preferenceApi
                    .updatePreference({
                        id: this.currentTheme.id,
                        namespace: "owf",
                        path: "selected_theme",
                        value: newTheme
                    })
                    .then((response) => get(response, "data.value", ""));
            }
        }
    }

    async toggle(): Promise<string | undefined> {
        return this.getTheme().then((theme) => {
            const newTheme = isNil(theme) || isBlank(theme) ? DARK_THEME : "";
            return this.setTheme(newTheme);
        });
    }
}

export const themeApi = new ThemeAPI();

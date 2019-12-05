import { Gateway, getGateway, ListOf, Response } from "../interfaces";
import {
    PreferenceCreateRequest,
    PreferenceDeleteRequest,
    PreferenceDTO,
    PreferenceUpdateRequest,
    validatePreferenceDetailResponse,
    validatePreferenceListResponse
} from "../models/PreferenceDTO";

export class UserPreferenceAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getPreferences(): Promise<Response<ListOf<PreferenceDTO[]>>> {
        return this.gateway.get("preferences/", {
            validate: validatePreferenceListResponse
        });
    }

    async getPreference(namespace: string, path: string): Promise<Response<ListOf<PreferenceDTO[]>>> {
        return this.gateway.get(`preferences/?namespace=${namespace}&path=${path}`, {
            // TODO: this may need to change based on the caller from the ThemeAPI
            validate: validatePreferenceListResponse
        });
    }

    async createPreference(data: PreferenceCreateRequest): Promise<Response<PreferenceDTO>> {
        return this.gateway.post("preferences/", data, {
            // TODO: verify the data being sent up is what the api expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validatePreferenceDetailResponse
        });
    }

    async updatePreference(data: PreferenceUpdateRequest): Promise<Response<PreferenceDTO>> {
        return this.gateway.put(`preferences/${data.id}/`, data, {
            // TODO: verify the data being sent up is what the api expects.
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validatePreferenceDetailResponse
        });
    }

    async deletePreference(data: PreferenceDeleteRequest): Promise<Response<PreferenceDTO>> {
        return this.gateway.delete(`preferences/${data.id}/`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const userPreferenceApi = new UserPreferenceAPI();

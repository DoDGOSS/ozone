import * as qs from "qs";
import { has } from "lodash";

import { Gateway, getGateway, Response } from "../interfaces";

import {
    PreferenceCreateRequest,
    PreferenceDeleteRequest,
    PreferenceDTO,
    PreferenceGetResponse,
    PreferenceGetSingleResponse,
    PreferenceUpdateRequest,
    validatePreference,
    validatePreferenceGetResponse,
    validatePreferenceGetSingleResponse
} from "../models/PreferenceDTO";

export class PreferenceAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getPreferences(namespace?: string): Promise<Response<PreferenceGetResponse>> {
        if (namespace !== undefined) {
            return this.gateway.get(`prefs/preference/${namespace}/`);
        }

        return this.gateway.get("prefs/preference/", {
            validate: validatePreferenceGetResponse
        });
    }

    async getPreference(namespace: string, path: string): Promise<Response<PreferenceGetSingleResponse>> {
        const response = await this.gateway.get(`prefs/preference/${namespace}/${path}/`);

        const data = response.data;
        if (isSinglePreference(data)) {
            response.data = {
                success: true,
                preference: data
            };
        }

        validatePreferenceGetSingleResponse(response.data);

        return response as Response<PreferenceGetSingleResponse>;
    }

    async getServerResources(): Promise<Response<any>> {
        return this.gateway.get(`prefs/server/resources/`);
    }

    async createPreference(data: PreferenceCreateRequest): Promise<Response<PreferenceDTO>> {
        const requestData = qs.stringify({
            _method: "POST",
            value: data.value,
            userid: data.userId
        });

        return this.gateway.post(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validatePreference
        });
    }

    async updatePreference(data: PreferenceUpdateRequest): Promise<Response<PreferenceDTO>> {
        const requestData = qs.stringify({
            _method: "PUT",
            id: data.id,
            value: data.value,
            userid: data.userId
        });

        return this.gateway.put(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validatePreference
        });
    }

    async deletePreference(data: PreferenceDeleteRequest): Promise<Response<PreferenceDTO>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            id: data.id,
            userid: data.userId
        });

        return this.gateway.post(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: validatePreference
        });
    }
}

export const preferenceApi = new PreferenceAPI();

function isSinglePreference(value: unknown): value is PreferenceDTO {
    return has(value, "id");
}

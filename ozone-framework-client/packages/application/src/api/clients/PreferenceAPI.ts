import { Gateway, getGateway, Response } from "../interfaces";
import {
    PreferenceCreateRequest,
    PreferenceDeleteRequest,
    PreferenceDTO,
    PreferenceGetResponse,
    PreferenceGetSingleResponse,
    PreferenceUpdateRequest
} from "../models/PreferenceDTO";

import { has } from "lodash";
import * as qs from "qs";

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
            validate: PreferenceGetResponse.validate
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

        PreferenceGetSingleResponse.validate(response.data);

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
            validate: PreferenceDTO.validate
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
            validate: PreferenceDTO.validate
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
            validate: PreferenceDTO.validate
        });
    }
}

export const preferenceApi = new PreferenceAPI();

function isSinglePreference(value: unknown): value is PreferenceDTO {
    return has(value, "id");
}

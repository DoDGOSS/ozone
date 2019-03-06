
import {
	Gateway,
	getGateway,
	Response
} from "../interfaces";
import {
    PreferenceCreateRequest,
    PreferenceCreateResponse,
    PreferenceDeleteResponse,
    PreferenceDTO,
    PreferenceGetResponse,
    PreferenceUpdateRequest,
    PreferenceUpdateResponse
} from "../models/PreferenceDTO";
import * as qs from "qs";

export class PreferenceAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getPreferences(namespace?: string): Promise<Response<any>> {
        if (namespace !== undefined) {
            return this.gateway.get(`prefs/preference/${namespace}/`);
        }

        return this.gateway.get("prefs/preference/", {
            validate: PreferenceGetResponse.validate
        });
    }

    async getPreference(namespace: string, path: string): Promise<Response<any>> {
        return this.gateway.get(`prefs/preference/${namespace}/${path}/`, {
            validate: PreferenceDTO.validate
        });
    }

    async getServerResources(): Promise<Response<any>> {
        return this.gateway.get(`prefs/server/resources/`);
    }


    async createPreference(data: PreferenceCreateRequest): Promise<Response<PreferenceCreateResponse>> {
        const requestData = qs.stringify({
            _method: "POST",
            value: data.value
        });

        return this.gateway.post(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: PreferenceCreateResponse.validate
        });
    }

    async updatePreference(data: PreferenceUpdateRequest): Promise<Response<PreferenceUpdateResponse>> {
        const requestData = qs.stringify({
            _method: "PUT",
            value: data.value
        });

        return this.gateway.put(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: PreferenceUpdateResponse.validate
        });
    }

    async deletePreference(data: PreferenceUpdateRequest): Promise<Response<PreferenceDeleteResponse>> {
        const requestData = qs.stringify(
            {
                _method: "DELETE",
                preference: JSON.stringify(data)
            }
        );

        return this.gateway.post(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: PreferenceDeleteResponse.validate
        });
    }
}

export const preferenceApi = new PreferenceAPI();

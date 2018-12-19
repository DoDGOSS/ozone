import * as qs from 'qs';

import { inject, injectable, TYPES } from "../../inject";

import {
    Gateway,
    Response,
    UuidDto,
    WidgetCreateRequest,
    WidgetCreateResponse,
    WidgetDeleteResponse,
    WidgetGetResponse
} from "..";


@injectable()
export class WidgetAPI {

    private readonly gateway: Gateway;

    constructor(@inject(TYPES.Gateway) gateway: Gateway) {
        this.gateway = gateway;
    }

    async getWidgets(): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get("widget/", {
            validate: WidgetGetResponse.validate
        });
    }

    async getWidgetById(id: string): Promise<Response<WidgetGetResponse>> {
        return this.gateway.get(`widget/${id}/`, {
            validate: WidgetGetResponse.validate
        });
    }

    async createWidget(data: WidgetCreateRequest): Promise<Response<WidgetCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetCreateResponse.validate
        });
    }

    async deleteWidget(id: string | string[]): Promise<Response<WidgetDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(UuidDto.fromValues(id))
        });

        return this.gateway.post("widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: WidgetDeleteResponse.validate
        });
    }

}

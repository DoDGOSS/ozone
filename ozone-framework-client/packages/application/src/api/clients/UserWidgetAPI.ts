import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";

export interface UserWidgetQueryCriteria {
    limit?: number;
    offset?: number;
    user_id?: number;
}

export class UserWidgetAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getUserWidgets(criteria?: UserWidgetQueryCriteria): Promise<Response<any>> {
        return this.gateway.get("prefs/widget/", {
            params: getOptionParams(criteria)
        });
    }

    async deleteUserWidget(widgetGuid: string): Promise<Response<any>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            guid: widgetGuid
        });

        return this.gateway.post("prefs/widget/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export const userWidgetApi = new UserWidgetAPI();

function getOptionParams(options?: UserWidgetQueryCriteria): any | undefined {
    if (!options) return undefined;

    const params: any = {};
    if (options.limit) params.max = options.limit;
    if (options.offset) params.offset = options.offset;
    return params;
}

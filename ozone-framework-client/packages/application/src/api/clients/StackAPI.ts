import {
    Gateway,
    IdDto,
    Response,
    UuidDto,
    StackDTO,
    StackGetResponse,
    StackUpdateRequest,
    StackUpdateParams,
    StackUpdateResponse,
    StackDeleteResponse
} from "..";
import * as qs from "qs";
import { Gateway, getGateway, Response } from "../interfaces";

export class StackAPI {

    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getStacks(): Promise<Response<StackGetResponse>> {
        return this.gateway.get("stack/", {
            validate: StackGetResponse.validate
        });
    }

    async getStackById(id: number): Promise<Response<StackGetResponse>> {
        return this.gateway.get(`stack/${id}/`, {
            validate: StackGetResponse.validate
        });
    }

    async createStack(data: StackUpdateRequest, options?: StackUpdateParams): Promise<Response<StackUpdateResponse>> {
        // const requestData = buildStackUpdateRequest(data, options);
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post(`stack/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: StackUpdateResponse.validate
        });
    }

    async updateStack(data: StackUpdateRequest, options?: StackUpdateParams): Promise<Response<StackUpdateResponse>> {
        // const requestData = buildStackdUpdateRequest(data, options);
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.put(`stack/${data.guid}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: StackUpdateResponse.validate
        });
    }

    deleteStack(id: number | number[]): Promise<Response<StackDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE",
            data: JSON.stringify(IdDto.fromValues(id))
        });

        return this.gateway.post("stack/", requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: StackDeleteResponse.validate
        });
    }


}

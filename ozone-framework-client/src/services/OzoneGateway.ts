import axios from "axios";
import * as _ from "lodash";

import { injectable } from "../inject";
import { AuthenticationError, Gateway, RequestOptions, Response } from "../api";



@injectable()
export class OzoneGateway implements Gateway {

    private readonly rootUrl: string;

    private _isAuthenticated: boolean = false;

    constructor(baseUrl: string = "http://localhost:8080") {
        this.rootUrl = _.trimEnd(baseUrl, "/");
    }


    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    async login(username: string, password: string): Promise<Response<any>> {
        try {
            return await axios.post(`${this.rootUrl}/perform_login`, null, {
                withCredentials: true,
                params: {
                    username,
                    password
                }
            });
        } catch (ex) {
            if (ex.response.status === 401) {
                throw new AuthenticationError("Invalid username or password", ex);
            }
            throw new AuthenticationError("Unknown error", ex);
        }
    }



    async get<T>(url: string, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = _.trimStart(url, "/");

        const response = await axios.get(`${this.rootUrl}/${normalizedUrl}`, {
            withCredentials: true,
            headers,
            params
        });

        if (validate) validate(response.data);

        return response;
    }

    async post<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = _.trimStart(url, "/");

        const response = await axios.post(`${this.rootUrl}/${normalizedUrl}`, data, {
            withCredentials: true,
            headers,
            params
        });

        if (validate) validate(response.data);

        return response;
    }

    async delete<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = _.trimStart(url, "/");

        const response = await axios.delete(`${this.rootUrl}/${normalizedUrl}`, {
            withCredentials: true,
            headers,
            params,
            data
        });

        if (validate) validate(response.data);

        return response;
    }

}

export interface User {
    id: number;
    username: string;
    displayName: string;
}

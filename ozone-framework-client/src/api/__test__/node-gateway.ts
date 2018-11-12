import axios from "axios";
import * as _ from "lodash";

import { Gateway, RequestOptions, Response } from "../";


export class NodeGateway implements Gateway {

    private readonly rootUrl: string;

    private sessionCookie: string | null = null;

    constructor(baseUrl: string = "http://localhost:8080") {
        this.rootUrl = _.trimEnd(baseUrl, "/");
    }

    async login(username: string, password: string): Promise<Response<any>> {
        const response = await axios.post(`${this.rootUrl}/perform_login`, null, {
            params: {
                username,
                password
            }
        });

        this.sessionCookie = getSessionCookie(response.headers);

        return response;
    }

    get isAuthenticated(): boolean {
        return !_.isNil(this.sessionCookie);
    }

    async get<T>(url: string, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = _.trimStart(url, "/");

        const response = await axios.get(`${this.rootUrl}/${normalizedUrl}`, {
            headers: this.getHeaders(headers),
            params
        });

        if (validate) validate(response.data);

        return response;
    }

    async post<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = _.trimStart(url, "/");

        const requestOptions = {
            headers: this.getHeaders(headers),
            params
        };

        const response = await axios.post(`${this.rootUrl}/${normalizedUrl}`, data, requestOptions);

        if (validate) validate(response.data);

        return response;
    }

    async delete<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = _.trimStart(url, "/");

        const requestOptions = {
            headers: this.getHeaders(headers),
            params,
            data
        };

        const response = await axios.delete(`${this.rootUrl}/${normalizedUrl}`, requestOptions);

        if (validate) validate(response.data);

        return response;
    }

    private getHeaders(additionalHeaders?: any): any {
        const defaultHeaders = {
            Cookie: this.sessionCookie
        };

        if (!additionalHeaders) return defaultHeaders;

        return { ...defaultHeaders, ...additionalHeaders };
    }

}

function getSessionCookie(headers: any) {
    const cookies: string[] = headers["set-cookie"];
    for (const cookie of cookies) {
        if (cookie && cookie.startsWith("JSESSIONID=")) return cookie;
    }
    return null;
}

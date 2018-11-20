import axios from "axios";

import { isNil, trimEnd, trimStart } from "lodash";

import { AuthenticationError, AuthUserDTO, Gateway, RequestOptions, Response, ValidationError } from "../..";


export class NodeGateway implements Gateway {

    private readonly rootUrl: string;

    private sessionCookie: string | null = null;

    constructor(baseUrl: string = "http://localhost:8080") {
        this.rootUrl = trimEnd(baseUrl, "/");
    }

    async login(username: string, password: string): Promise<Response<AuthUserDTO>> {
        const response = await axios.post(`${this.rootUrl}/perform_login`, null, {
            params: {
                username,
                password
            }
        });

        AuthUserDTO.validate(response.data);

        this.sessionCookie = getSessionCookie(response.headers);

        return response;
    }

    async getLoginStatus(): Promise<Response<AuthUserDTO>> {
        try {
            return await this.get(`login/status`, {
                validate: AuthUserDTO.validate
            });
        } catch (ex) {
            if (ex instanceof ValidationError) throw ex;
            throw new AuthenticationError("Authentication Required", ex);
        }
    }

    get isAuthenticated(): boolean {
        return !isNil(this.sessionCookie);
    }

    async get<T>(url: string, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = trimStart(url, "/");

        const response = await axios.get(`${this.rootUrl}/${normalizedUrl}`, {
            headers: this.getHeaders(headers),
            params
        });

        if (validate) validate(response.data);

        return response;
    }

    async post<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = trimStart(url, "/");

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
        const normalizedUrl = trimStart(url, "/");

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

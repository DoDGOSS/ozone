import axios from "axios";
import { get, isNil, trimEnd, trimStart } from "lodash";

import { Gateway, RequestOptions, Response } from "../../src/api/interfaces";
import { AuthenticationError, ValidationError } from "../../src/api/errors";
import { AuthUserDTO, validateAuthUser } from "../../src/api/models/AuthUserDTO";
import { getCookie } from "../../src/utility";

export class NodeGateway implements Gateway {
    private readonly rootUrl: string;

    private sessionCookie: string | null = null;

    constructor(baseUrl?: string) {
        if (!baseUrl) {
            baseUrl = getDefaultBaseUrl();
        }

        this.rootUrl = trimEnd(baseUrl, "/");
    }

    async login(username: string, password: string): Promise<Response<AuthUserDTO>> {
        try {
            const response = await axios.post(`${this.rootUrl}/auth/login/`, null, {
                params: {
                    username,
                    password
                }
            });

            validateAuthUser(response.data);

            this.sessionCookie = getSessionCookie(response.headers);

            return response;
        } catch (ex) {
            if (ex instanceof ValidationError) throw ex;

            if (ex.response.status === 401) {
                throw new AuthenticationError("Invalid username or password", ex);
            }
            throw new AuthenticationError("Unknown error", ex);
        }
    }

    async logout(): Promise<Response<any>> {
        const response = await this.get(`auth/logout/`);
        return response;
    }

    async getLoginStatus(): Promise<Response<AuthUserDTO>> {
        try {
            return await this.get(`me/`, {
                validate: validateAuthUser
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

    async put<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = trimStart(url, "/");

        const requestOptions = {
            headers: this.getHeaders(headers),
            params
        };

        const response = await axios.put(`${this.rootUrl}/${normalizedUrl}`, data, requestOptions);

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

    private getHeaders(initialHeaders?: any): any {
        return {
            ...initialHeaders,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
            Cookie: this.sessionCookie
        };
    }
}

function getSessionCookie(headers: any) {
    const cookies: string[] = headers["set-cookie"];
    for (const cookie of cookies) {
        if (cookie && cookie.startsWith("JSESSIONID=")) return cookie;
    }
    return null;
}

function getDefaultBaseUrl(): string {
    return get(process.env, "OZONE_API_SERVER_URL", "http://localhost:8000/api/v2") as string;
}

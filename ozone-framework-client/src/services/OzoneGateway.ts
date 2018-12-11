import axios from "axios";
import { trimEnd, trimStart } from "lodash";

import { injectable } from "../inject";
import { AuthenticationError, AuthUserDTO, Gateway, RequestOptions, Response, ValidationError } from "../api";


@injectable()
export class OzoneGateway implements Gateway {

    private readonly rootUrl: string;

    private _isAuthenticated: boolean = false;

    constructor(baseUrl: string = "http://localhost:8080") {
        this.rootUrl = trimEnd(baseUrl, "/");
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    async login(username: string, password: string): Promise<Response<AuthUserDTO>> {
        try {
            const response = await this.post(`perform_login`, null, {
                params: {
                    username,
                    password
                },
                validate: AuthUserDTO.validate
            });
            this._isAuthenticated = true;
            return response;
        } catch (ex) {
            this._isAuthenticated = false;

            if (ex instanceof ValidationError) throw ex;

            if (ex.response.status === 401) {
                throw new AuthenticationError("Invalid username or password", ex);
            }
            throw new AuthenticationError("Unknown error", ex);
        }
    }

    async getLoginStatus(): Promise<Response<AuthUserDTO>> {
        try {
            const response = await this.get(`login/status`, {
                validate: AuthUserDTO.validate
            });
            this._isAuthenticated = true;
            return response;
        } catch (ex) {
            this._isAuthenticated = false;

            if (ex instanceof ValidationError) throw ex;
            throw new AuthenticationError("Authentication Required", ex);
        }
    }

    async get<T>(url: string, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = trimStart(url, "/");

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
        const normalizedUrl = trimStart(url, "/");

        const response = await axios.post(`${this.rootUrl}/${normalizedUrl}`, data, {
            withCredentials: true,
            headers,
            params
        });

        if (validate) validate(response.data);

        return response;
    }

    async put<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = trimStart(url, "/");

        const response = await axios.put(`${this.rootUrl}/${normalizedUrl}`, data, {
            withCredentials: true,
            headers,
            params
        });

        if (validate) validate(response.data);

        return response;
    }

    async delete<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        const { params, headers, validate } = options;
        const normalizedUrl = trimStart(url, "/");

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

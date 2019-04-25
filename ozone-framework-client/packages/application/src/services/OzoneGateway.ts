import axios from "axios";

import { Gateway, RequestOptions, Response } from "../api/interfaces";
import { AuthUserDTO, validateAuthUser } from "../api/models/AuthUserDTO";

import { trimEnd, trimStart } from "lodash";
import { lazy } from "../utility";
import { AuthenticationError, ValidationError } from "../api/errors";

export class OzoneGateway implements Gateway {
    static readonly instance = lazy(() => new OzoneGateway());

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
            const response = await this.post("perform_login", null, {
                params: {
                    username,
                    password
                },
                validate: validateAuthUser
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

    async logout(): Promise<Response<{}>> {
        try {
            return await this.get("/logout");
        } catch (ex) {
            if (ex instanceof ValidationError) throw ex;
            if (ex.response.status === 401) {
                return ex.response;
            }
            throw new AuthenticationError("Unable to logout", ex);
        }
    }

    async getLoginStatus(): Promise<Response<AuthUserDTO>> {
        try {
            const response = await this.get(`login/status`, {
                validate: validateAuthUser
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
        try {
            const { params, headers, validate } = options;
            const normalizedUrl = trimStart(url, "/");

            const response = await axios.get(`${this.rootUrl}/${normalizedUrl}`, {
                withCredentials: true,
                headers,
                params
            });

            if (validate) validate(response.data);

            return response;
        } catch (ex) {
            if (ex instanceof AuthenticationError) {
                return this.toLogin();
            } else {
                throw ex;
            }
        }
    }

    async post<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        try {
            const { params, headers, validate } = options;
            const normalizedUrl = trimStart(url, "/");

            const response = await axios.post(`${this.rootUrl}/${normalizedUrl}`, data, {
                withCredentials: true,
                headers,
                params
            });

            if (validate) validate(response.data);

            return response;
        } catch (ex) {
            if (ex instanceof AuthenticationError) {
                return this.toLogin();
            } else {
                throw ex;
            }
        }
    }

    async put<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        try {
            const { params, headers, validate } = options;
            const normalizedUrl = trimStart(url, "/");

            const response = await axios.put(`${this.rootUrl}/${normalizedUrl}`, data, {
                withCredentials: true,
                headers,
                params
            });

            if (validate) validate(response.data);

            return response;
        } catch (ex) {
            if (ex instanceof AuthenticationError) {
                return this.toLogin();
            } else {
                throw ex;
            }
        }
    }

    async delete<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
        try {
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
        } catch (ex) {
            if (ex instanceof AuthenticationError) {
                return this.toLogin();
            } else {
                throw ex;
            }
        }
    }

    toLogin(): Promise<Response<any>> {
        // That doesn't work, but we can't include mainStore because that causes a circular depency chain. Or twenty.
        // this.logout();
        return new Promise<Response<{}>>(() => {
            return {};
        });
    }
}
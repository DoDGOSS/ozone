import axios from "axios";
import * as _ from "lodash";

import { injectable } from "../inject";

import { AsyncResponse, Response } from "./Response";
import { User } from "../models";


@injectable()
export class OzoneGateway {

    private readonly rootUrl: string;

    constructor(baseUrl: string = "http://localhost:8080") {
        this.rootUrl = _.trimEnd(baseUrl, "/");
    }

    async login(username: string, password: string): AsyncResponse<any> {
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

    async fetchUserStatus(): Promise<Response<User>> {
        return this.get("login/status");
    }

    async get<T = any>(url: string): AsyncResponse<T> {
        const normalizedUrl = _.trimStart(url, "/");
        return axios.get(`${this.rootUrl}/${normalizedUrl}`, {
            withCredentials: true
        });
    }

}


export class AuthenticationError extends Error {

    readonly cause: any;

    constructor(message: string, cause: any) {
        super(message);
        this.cause = cause;
    }

}

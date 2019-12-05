import { AuthUserDTO } from "./models/AuthUserDTO";

import { OzoneGateway } from "../services/OzoneGateway";

export interface Type<T> extends Function {
    // tslint:disable-next-line:callable-types
    new (...args: any[]): T;
}

export type Validator<T> = (data: unknown) => T;

export interface Gateway {
    readonly isAuthenticated: boolean;

    login(username: string, password: string): Promise<Response<AuthUserDTO>>;

    logout(): Promise<Response<{}>>;

    getLoginStatus(): Promise<Response<AuthUserDTO>>;

    get<T>(url: string, options?: RequestOptions<T>): Promise<Response<T>>;

    post<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;

    put<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;

    patch<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;

    delete<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;
}

export function getGateway(): Gateway {
    return OzoneGateway.instance();
}

export interface RequestOptions<T> {
    params?: any;
    headers?: any;
    validate?: Validator<T>;
}

export interface Response<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export interface ListOf<T> {
    // TODO: see if we can get rid of this and make the Response
    data: T;
    results: number;
    next: null | string;
    previous: null | string;
}

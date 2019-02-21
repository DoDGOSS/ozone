import { AuthUserDTO } from "./models/auth-dto";

import { Validator } from "@ozone/openapi-decorators";

export interface Gateway {
    readonly isAuthenticated: boolean;

    login(username: string, password: string): Promise<Response<AuthUserDTO>>;

    logout(): Promise<Response<{}>>;

    getLoginStatus(): Promise<Response<AuthUserDTO>>;

    get<T>(url: string, options?: RequestOptions<T>): Promise<Response<T>>;

    post<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;

    put<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;

    delete<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;
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

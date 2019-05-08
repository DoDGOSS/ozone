import { defaultsDeep } from "lodash";

declare global {
    interface Window {
        env: { [key: string]: any };
    }
}

export interface Environment {
    login: LoginOptions;
}

export interface LoginOptions {
    nextUrl: string;
}

const defaultEnvironment: Environment = {
    login: {
        nextUrl: "http://localhost:3000/"
    }
};

export function setDefaultEnvironment() {
    window.env = window.env || {};
    defaultsDeep(window.env, defaultEnvironment);
}

export function env(): Environment {
    return window.env as Environment;
}

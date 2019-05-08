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
    isEnabled: boolean;
    loginUrl: string;
}

const defaultEnvironment: Environment = {
    login: {
        isEnabled: true,
        loginUrl: "http://localhost:3000/consent.html"
    }
};

export function setDefaultEnvironment() {
    window.env = window.env || {};
    defaultsDeep(window.env, defaultEnvironment);
}

export function env(): Environment {
    return window.env as Environment;
}

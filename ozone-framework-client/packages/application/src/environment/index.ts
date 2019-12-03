import { defaultsDeep, trimEnd, trimStart } from "lodash";

import { Environment } from "./interfaces";

import { CONSENT_NOTICE, USER_AGREEMENT } from "./messages";
import { lazy } from "../utility";

export * from "./interfaces";

// @ts-ignore
const frontendUrlPlaceholder = envChecker ? "http://localhost:8000" : "http://localhost:3000";

const defaultEnvironment: Environment = {
    server: {
        backendUrl: "http://localhost:8000",
        frontendUrl: frontendUrlPlaceholder,
        staticAssetPath: ""
    },
    login: {
        isEnabled: true,
        loginUrl: "./login.html",
        nextUrl: "./"
    },
    logout: {
        isEnabled: true,
        logoutUrl: "./login.html?out=1"
    },
    consentNotice: {
        isEnabled: true,
        title: CONSENT_NOTICE.title,
        message: CONSENT_NOTICE.content,
        details: {
            isEnabled: true,
            linkText: CONSENT_NOTICE.link
        },
        nextUrl: "./login.html"
    },
    userAgreement: {
        title: USER_AGREEMENT.title,
        message: USER_AGREEMENT.content
    }
};

export function setDefaultEnvironment() {
    window.env = window.env || {};
    defaultsDeep(window.env, defaultEnvironment);
}

export function env(): Environment {
    return window.env as Environment;
}

/**
 * returns the URL of the backend (with no trailing slash)
 */
export const backendUrl = lazy(() => normalize(env().server.backendUrl));

/**
 * returns the context path of the backend URL (with leading slash and no trialing slash)
 */
export const backendContextPath = lazy(() => new URL(backendUrl()).pathname);

/**
 * returns the URL of the frontend (with no trailing slash)
 */
export const frontendUrl = lazy(() => normalize(env().server.frontendUrl));

/**
 * @returns the URL for static assets (with no trailing slash, may be relative or absolute)
 */
export const staticAssetPath = lazy(() => trimEnd(resolveFrontendUrl(env().server.staticAssetPath), "/"));

export const loginUrl = lazy(() => resolveFrontendUrl(env().login.loginUrl));

export const loginNextUrl = lazy(() => resolveFrontendUrl(env().login.nextUrl));

export const logoutUrl = lazy(() => resolveFrontendUrl(env().logout.logoutUrl));

export const consentNextUrl = lazy(() => {
    const nextUrl = env().consentNotice.nextUrl;
    if (!nextUrl) return loginUrl();
    return resolveFrontendUrl(nextUrl);
});

/**
 * @returns the URL of an asset, resolved relative to the static asset path
 */
export function assetUrl(path?: string): string {
    if (!path) return "";

    // Absolute path?
    if (path.startsWith("http")) {
        return path;
    }

    return `${staticAssetPath()}/${normalize(path)}`;
}

/**
 * @returns a URL path relative to the frontend URL, or an absolute URL if it is not relative
 */
function resolveFrontendUrl(url: string): string {
    const _url = new URL(url, `${frontendUrl()}/`);

    // Absolute path?
    if (!_url.href.startsWith(frontendUrl())) {
        return _url.href + _url.search;
    }

    return _url.pathname + _url.search;
}

/**
 * @returns the value with leading and trailing slashes removed
 */
function normalize(value: string): string {
    return trimStart(trimEnd(value, "/"), "/");
}

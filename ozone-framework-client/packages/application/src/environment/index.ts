import { defaultsDeep } from "lodash";

import { Environment } from "./interfaces";

import { CONSENT_NOTICE, USER_AGREEMENT } from "../pages/ConsentPage/messages";

export * from "./interfaces";

const defaultEnvironment: Environment = {
    server: {
        url: "http://localhost:8080",
        frontendUrl: "http://localhost:3000",
        contextPath: "",
        staticAssetPath: ""
    },
    login: {
        isEnabled: true,
        loginUrl: "http://localhost:3000/login.html",
        nextUrl: "http://localhost:3000/"
    },
    logout: {
        isEnabled: true,
        logoutUrl: "http://localhost:3000/login.html?out=1"
    },
    consentNotice: {
        isEnabled: true,
        title: CONSENT_NOTICE.title,
        message: CONSENT_NOTICE.content,
        details: {
            isEnabled: true,
            linkText: CONSENT_NOTICE.link
        },
        nextUrl: "http://localhost:3000/login.html"
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

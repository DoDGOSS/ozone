import { defaultsDeep } from "lodash";

import { ConsentNoticeOptions } from "../../features/ConsentNotice";
import { UserAgreementOptions } from "../../features/UserAgreement";

import { CONSENT_NOTICE, USER_AGREEMENT } from "./messages";

declare global {
    interface Window {
        env: { [key: string]: any };
    }
}

export interface Environment {
    consentNotice: ConsentNoticeOptions;
    userAgreement: UserAgreementOptions;
}

const defaultEnvironment: Environment = {
    consentNotice: {
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

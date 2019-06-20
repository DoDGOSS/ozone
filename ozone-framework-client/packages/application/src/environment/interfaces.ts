declare global {
    interface Window {
        env: Environment;
    }
}

export interface Environment {
    server: ServerOptions;
    login: LoginOptions;
    logout: LogoutOptions;
    consentNotice: ConsentNoticeOptions;
    userAgreement: UserAgreementOptions;
    autoSaveInterval?: number;
}

export interface ServerOptions {
    url: string;
    frontendUrl: string;
    contextPath: string;
    staticAssetPath: string;
}

export interface LoginOptions {
    isEnabled: boolean;
    loginUrl: string;
    nextUrl: string;
}

export interface LogoutOptions {
    isEnabled: boolean;
    logoutUrl: string;
}

export interface ConsentNoticeOptions {
    isEnabled?: boolean;
    title: string;
    message: string;
    details: {
        isEnabled: boolean;
        linkText: string;
    };
    nextUrl?: string;
}

export interface UserAgreementOptions {
    title: string;
    message: string;
}

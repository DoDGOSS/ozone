export interface Type<T> extends Function {
    new(...args: any[]): T;
}

export interface ClassificationConfig {
    text: string;
    backgroundColor: string;
    foregroundColor: string;

    disableTopBanner?: boolean;
    disableBottomBanner?: boolean;
}

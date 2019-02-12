export interface Type<T> extends Function {
    new(...args: any[]): T;
}


export type Validator<T> = (data: any) => T;


export interface ModelOptions {
    name?: string;
}


export interface PropertyOptions {
    required?: boolean;
    nullable?: boolean;
    readOnly?: boolean;
    enum?: string[];
    maxLength?: number;
}

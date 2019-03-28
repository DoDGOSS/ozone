import { AxiosError } from "axios";

export class AuthenticationError extends Error {
    readonly cause: AxiosError;

    constructor(message: string, cause: any) {
        super(message);
        this.cause = cause;
    }
}

export class ValidationError extends Error {
    readonly errors: any;

    constructor(message: string, errors: any) {
        super(message);
        this.errors = errors;
    }
}

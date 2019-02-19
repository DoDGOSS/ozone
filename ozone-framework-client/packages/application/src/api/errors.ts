export class AuthenticationError extends Error {
    readonly cause: any;

    constructor(message: string, cause: any) {
        super(message);
        this.cause = cause;
    }
}

export class ValidationError extends Error {

    readonly errors: any;

    constructor(message: string, errors: any) {
        super(message);
        this.errors = errors;
    }

}

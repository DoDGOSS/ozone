export interface ModelOptions {
    name?: string;
}

export interface PropertyOptions {
    required?: boolean;
    nullable?: boolean;
    readOnly?: boolean;
    enum?: string[];
}

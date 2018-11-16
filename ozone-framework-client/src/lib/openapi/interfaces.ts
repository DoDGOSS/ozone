export interface SchemaOptions {
    name?: string;
}

export interface PropertyOptions {
    required?: boolean;
    nullable?: boolean;
    readOnly?: boolean;
    enum?: string[];
}


export interface ResponseOptions {
    name?: string;
    description: string;
    mediaType?: string;
}

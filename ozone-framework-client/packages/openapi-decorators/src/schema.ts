export interface OAS3 {
    openapi: "3.0.0" | "3.0.1" | "3.0.2";
    info: Info;
    servers?: Server[];
    paths: Paths;
    components?: Components;
    security?: SecurityRequirement[];
    tags?: Tag[];
    externalDocs?: ExternalDocumentation;
}


export interface Info {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: Contact;
    version: string;
    license?: License;
}


export interface Contact {
    name?: string;
    url?: string;
    email?: string;
}


export interface License {
    name: string;
    url?: string;
}


export interface Server {
    url: string;
    description?: string;
    variables?: { [name: string]: ServerVariable };
}


export interface ServerVariable {
    enum?: string[];
    default: string;
    description?: string;
}


export interface SecurityRequirement {
    [key: string]: string[];
}


export interface Tag {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentation;
}


export interface ExternalDocumentation {
    description?: string;
    url: string;
}


export interface Paths {
    [key: string]: PathItem;
}


export interface PathItem {
    summary?: string;
    description?: string;
    get?: Operation;
    put?: Operation;
    post?: Operation;
    delete?: Operation;
    options?: Operation;
    head?: Operation;
    patch?: Operation;
    trace?: Operation;
    servers?: Server[];
    parameters?: (Parameter | Reference)[];
}


export interface Operation {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentation;
    operationId?: string;
    parameters?: (Parameter | Reference)[];
    requestBody?: RequestBody | Reference;
    responses: Responses;
    callbacks?: { [key: string]: Callback | Reference };
    deprecated?: boolean;
    security?: SecurityRequirement[];
    servers?: Server[];
}


interface Responses {
    default?: Response | Reference;

    [key: string]: Response | Reference | undefined;
}


export interface Components {
    schemas?: { [key: string]: Schema | Reference };
    responses?: { [key: string]: Response | Reference };
    parameters?: { [key: string]: Parameter | Reference };
    examples?: { [key: string]: Example | Reference };
    requestBodies?: { [key: string]: RequestBody | Reference };
    headers?: { [key: string]: Header | Reference };
    securitySchemes?: { [key: string]: SecurityScheme | Reference };
    links?: { [key: string]: Link | Reference };
    callbacks?: { [key: string]: Callback | Reference };
}


export interface Schema {
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    items?: Schema | Reference;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    properties?: { [key: string]: Schema | Reference };
    additionalProperties?: boolean | Schema | Reference;
    enum?: any[];
    type?: "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";
    allOf?: (Schema | Reference)[];
    anyOf?: (Schema | Reference)[];
    oneOf?: (Schema | Reference)[];
    not?: Schema | Reference;
    format?: string;
    nullable?: boolean;

    title?: string;
    description?: string;
    default?: any;

    discriminator?: Discriminator;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XML;
    externalDocs?: ExternalDocumentation;
    example?: any;
    deprecated?: boolean;
}


export interface Discriminator {
    propertyName: string;
    mapping?: { [key: string]: string };
}


export interface XML {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}


export interface Reference {
    $ref: string;
}


export interface Response {
    description: string;
    headers?: { [key: string]: Header | Reference };
    content?: { [key: string]: MediaType };
    links?: { [key: string]: Link | Reference };
}


export type Style = "matrix" | "label" | "form" | "simple" | "spaceDelimited" | "pipeDelimited" | "deepObject";


export interface Parameter {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: Style;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: Schema | Reference;
    example?: any;
    examples?: { [key: string]: Example | Reference };
    content?: { [key: string]: MediaType };
}


export interface Example {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}


export interface RequestBody {
    description?: string;
    content: { [key: string]: MediaType };
    required?: boolean;
}


export interface Header {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: Style;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: Schema | Reference;
    example?: any;
    examples?: { [key: string]: Example | Reference };
    content?: { [key: string]: MediaType };
}


export type SecurityScheme =
    ApiKeySecurityScheme
    | HttpSecurityScheme
    | OAuth2SecurityScheme
    | OpenIDConnectSecurityScheme;


export interface ApiKeySecurityScheme {
    type: "apiKey";
    description?: string;
    name: string;
    in: "query" | "header" | "cookie";
}


export interface HttpSecurityScheme {
    type: "http";
    description?: string;
    scheme: string;
    bearerFormat?: string;
}


export interface OAuth2SecurityScheme {
    type: "oauth2";
    description?: string;
    flows: OAuthFlows;
}


export interface OpenIDConnectSecurityScheme {
    type: "openIdConnect";
    description?: string;
    openIdConnectUrl: string;
}


export interface OAuthFlows {
    implicit?: OAuthFlow;
    password?: OAuthFlow;
    clientCredentials?: OAuthFlow;
    authorizationCode?: OAuthFlow;
}


export interface OAuthFlow {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes?: { [key: string]: string };
}


export interface Link {
    operationRef?: string;
    operationId?: string;
    parameters?: { [key: string]: any };
    requestBody?: any;
    description?: string;
    server?: Server;
}


export interface Callback {
    [key: string]: PathItem;
}


export interface MediaType {
    schema?: Schema | Reference;
    example?: any;
    examples?: { [key: string]: Example | Reference };
    encoding?: { [key: string]: Encoding };
}


export interface Encoding {
    contentType?: string;
    headers?: { [key: string]: Header | Reference };
    style?: Style;
    explode?: boolean;
    allowReserved?: boolean;
}

export interface Response<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export type AsyncResponse<T> = Promise<Response<T>>;

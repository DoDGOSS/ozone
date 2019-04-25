declare interface Dictionary<T> {
    [key: string]: T;
}

declare interface NumericDictionary<T> {
    [key: number]: T;
}

declare type PropertiesOf<T> = { [K in keyof T]: T[K] };

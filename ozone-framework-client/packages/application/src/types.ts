declare type Dictionary<T> = { [key: string]: T };

declare type PropertiesOf<T> = { [K in keyof T]: T[K] };

declare type PropertyOf<T, K extends keyof T> = T[K];

declare type Collection<T> = ArrayLike<T> | Dictionary<T>;

declare type Iteratee<T, R> = (value: T) => R;

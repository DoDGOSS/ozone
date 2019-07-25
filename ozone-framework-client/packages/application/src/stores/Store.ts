export interface StoreSubscription {
    readonly closed: boolean;

    unsubscribe(): void;
}

export interface Store<T> {
    readonly value: T;

    subscribe(next: (value: T) => void): StoreSubscription;
}

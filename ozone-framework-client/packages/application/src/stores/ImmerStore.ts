import produce from "immer";
import { BehaviorSubject } from "rxjs";

import { Store, StoreSubscription } from "./Store";

export abstract class ImmerStore<T> implements Store<T> {
    private readonly state$: BehaviorSubject<T>;

    protected constructor(initialState: T) {
        this.state$ = new BehaviorSubject<T>(initialState);
    }

    get value() {
        return this.state$.value;
    }

    subscribe(observer: (value: T) => void): StoreSubscription {
        return this.state$.subscribe(observer);
    }

    protected next<R extends T | void = void>(recipe: (state: T) => R): void {
        // @ts-ignore
        this.state$.next(produce(this.state$.value, recipe));
    }
}

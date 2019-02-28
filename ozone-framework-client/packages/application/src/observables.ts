import { BehaviorSubject, Observable } from "rxjs";

export type BehaviorObservable<T> = Observable<T> & {
    readonly value: T;
};

export type BehaviorFactory<T> = () => BehaviorObservable<T>;

export function asBehavior<T>(behaviorSubject: BehaviorSubject<T>): BehaviorObservable<T> {
    return behaviorSubject as BehaviorObservable<T>;
}

export function asObservable<T>(observable: Observable<T>): Observable<T> {
    return observable as Observable<T>;
}

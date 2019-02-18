import { useObservable } from "rxjs-hooks";
import { BehaviorFactory } from "./observables";

export function useBehavior<T>(behaviorFactory: BehaviorFactory<T>): T {
    return useObservable(behaviorFactory, behaviorFactory().value);
}

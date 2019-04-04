import { useObservable } from "rxjs-hooks";
import { BehaviorFactory, BehaviorObservable } from "./observables";
import { useEffect, useState } from "react";

export function useBehavior<T>(behaviorFactory: BehaviorFactory<T>): T {
    return useObservable(behaviorFactory, behaviorFactory().value);
}

export function useBehavior2<T>(behaviorFactory: () => BehaviorObservable<T>): T {
    const behavior = behaviorFactory();

    const [state, setState] = useState(behavior.value);

    useEffect(() => {
        const subscription = behavior.subscribe((value) => {
            setState(value);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [behavior]);

    return state;
}

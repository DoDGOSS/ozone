import { useEffect, useState } from "react";

import { BehaviorObservable } from "../observables";

export function useSelector<T, U>(behaviorFactory: () => BehaviorObservable<T>, selector: (value: T) => U): U {
    const behavior = behaviorFactory();

    const [state, setState] = useState(() => selector(behavior.value));

    useEffect(() => {
        const subscription = behavior.subscribe((value) => {
            const nextState = selector(value);
            if (nextState !== state) {
                setState(nextState);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [behavior, state]);

    return state;
}

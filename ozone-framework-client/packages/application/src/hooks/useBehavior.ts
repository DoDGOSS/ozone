import { useEffect, useState } from "react";

import { BehaviorObservable } from "../observables";

export function useBehavior<T>(behaviorFactory: () => BehaviorObservable<T>): T {
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

import { Store } from "../stores/Store";
import { useEffect, useState } from "react";

export type Selector<T, U> = (value: T) => U;

// TODO: Can be optimized a bit. See: https://github.com/reduxjs/react-redux/blob/master/src/hooks/useSelector.js
export function useStoreSelector<T, U>(store: Store<T>, selector: Selector<T, U>): U {
    const [state, setState] = useState(() => selector(store.value));

    useEffect(() => {
        const subscription = store.subscribe((value) => {
            const nextState = selector(value);
            if (nextState !== state) {
                setState(nextState);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [store, selector, state]);

    return state;
}

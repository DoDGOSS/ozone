import { useEffect, useState } from "react";

import { Store } from "../stores/Store";

export function useStore<T>(store: Store<T>): T {
    const [state, setState] = useState(store.value);

    useEffect(() => {
        const subscription = store.subscribe((value) => setState(value));
        return () => subscription.unsubscribe();
    }, [store]);

    return state;
}

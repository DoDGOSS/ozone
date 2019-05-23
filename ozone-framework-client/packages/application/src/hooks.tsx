import { BehaviorObservable } from "./observables";

import React, { useCallback, useEffect, useMemo, useState } from "react";

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

export interface Toggleable {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    toggle: () => void;
}

export function useToggleable(initialValue: boolean): Toggleable {
    const [isVisible, setIsVisible] = useState(initialValue);
    const show = useCallback(() => setIsVisible(true), []);
    const hide = useCallback(() => setIsVisible(false), []);
    const toggle = useCallback(() => setIsVisible(!isVisible), [isVisible]);

    return useMemo(
        () => ({
            isVisible,
            show,
            hide,
            toggle
        }),
        [isVisible, show, hide, toggle]
    );
}

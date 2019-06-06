import { BehaviorObservable } from "./observables";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { isEqual } from "lodash";

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

export function useMemoDeep<T>(value: T): T {
    const ref = useRef(value);
    if (!isEqual(ref.current, value)) {
        ref.current = value;
    }
    return ref.current;
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

export function useTimeout(duration: number): [(callback: () => void) => void, () => void] {
    const [timer, setTimer] = useState<number | undefined>();

    const reset = useCallback(() => {
        if (timer) {
            clearTimeout(timer);
            setTimer(undefined);
        }
    }, [timer, setTimer]);

    const start = useCallback(
        (callback: () => void) => {
            reset();
            setTimer(setTimeout(() => {
                callback();
                setTimer(undefined);
            }, duration) as any);
        },
        [reset, setTimer, duration]
    );

    return useMemo(() => [start, reset], [start, reset]);
}

export function useDoubleClick(duration: number, callback: () => void): () => void {
    const [clicked, setClicked] = useState(false);
    const [setTimer, resetTimer] = useTimeout(duration);

    return useCallback(() => {
        if (clicked) {
            callback();
            resetTimer();
            setClicked(false);
        } else {
            setClicked(true);
            setTimer(() => setClicked(false));
        }
    }, [callback, clicked, setClicked, setTimer, resetTimer]);
}

/*
 * Works like useState, except you can pass in an async function as the intial value, and it will get set
 * as soon as the function returns. Really just a convenient wrapper.
 * But with this, in a function component, the async call will only be made once, instead of on every render like it would
 * with a simple useState + async call in series at the top of the function.
 */
export function useStateAsyncInit<T>(asyncInitFunction: () => Promise<T>, safeValue: T): T {
    const [data, setData] = useState<T>(safeValue);
    useEffect(() => {
        asyncInitFunction().then((result: T) => setData(result));
    }, []);

    return data;
}

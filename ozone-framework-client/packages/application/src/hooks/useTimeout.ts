import { useCallback, useMemo, useState } from "react";

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

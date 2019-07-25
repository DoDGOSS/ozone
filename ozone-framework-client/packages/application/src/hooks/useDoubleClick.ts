import { useCallback, useState } from "react";

import { useTimeout } from "./useTimeout";

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

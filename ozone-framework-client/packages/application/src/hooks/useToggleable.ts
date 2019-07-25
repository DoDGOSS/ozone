import { useCallback, useMemo, useState } from "react";

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

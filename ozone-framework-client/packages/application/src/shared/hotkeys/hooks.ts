import { useEffect, useRef } from "react";

import { useMemoDeep } from "../../hooks";

import { hotkeysService } from "./HotkeysService";
import { HotkeyAction, HotkeyOpts } from "./types";

/**
 * Adds the global listeners for the Hotkeys service, and removes them when the component is unmounted.
 *
 * Should only be used once in a top-level component.
 */
export function useHotkeysService() {
    useEffect(() => {
        hotkeysService.addListeners();
        return () => hotkeysService.removeListeners();
    }, []);
}

/**
 * Register a Hotkey binding with the Hotkeys service, and removes the binding when the component is unmounted.
 */
export function useHotkey(opts: HotkeyOpts): void {
    const options = useMemoDeep(opts);
    const action = useRef<HotkeyAction>();

    useEffect(() => {
        action.current = hotkeysService.register(options);

        return () => {
            if (action.current) {
                hotkeysService.unregister(action.current);
                action.current = undefined;
            }
        };
    }, [options]);
}

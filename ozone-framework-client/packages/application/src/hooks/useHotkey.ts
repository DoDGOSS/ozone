import { HotkeyAction, HotkeyOpts, hotkeysService } from "../shared/hotkeys";
import { useMemoDeep } from "./useMemoDeep";
import { useEffect, useRef } from "react";

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

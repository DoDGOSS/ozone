import { useEffect } from "react";

import { hotkeysService } from "../shared/hotkeys";

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

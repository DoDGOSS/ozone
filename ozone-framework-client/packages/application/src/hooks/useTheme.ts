import { useBehavior } from "./useBehavior";

import { mainStore } from "../stores/MainStore";

export function useTheme(): string {
    return useBehavior(mainStore.themeClass);
}

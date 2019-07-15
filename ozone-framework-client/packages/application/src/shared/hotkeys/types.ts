import { IKeyCombo } from "@blueprintjs/core";

export interface HotkeyAction {
    readonly id: string;
    readonly combo: IKeyCombo;
    readonly onKeyDown?: () => void;
    readonly onKeyUp?: () => void;
    readonly allowInInput: boolean;
    readonly preventDefault: boolean;
    readonly stopPropagation: boolean;
}

export interface HotkeyOpts {
    combo: string | IKeyCombo;
    onKeyDown?: () => void;
    onKeyUp?: () => void;
    allowInInput?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}

export const Shortcuts = {
    showDesktop: "alt+shift+o",
    showHelp: "alt+shift+h",
    showStacks: "alt+shift+c",
    showStore: "alt+shift+m",
    showSwitcher: "alt+shift+q",
    showWidgets: "alt+shift+f",
    toggleTheme: "alt+shift+t"
} as const;

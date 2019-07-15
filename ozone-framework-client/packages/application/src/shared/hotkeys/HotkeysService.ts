import { comboMatches, getKeyCombo, parseKeyCombo } from "@blueprintjs/core";

import { uuid } from "../../utility";

import { HotkeyAction, HotkeyOpts } from "./types";

// Reference source: @blueprintjs/core/src/components/hotkeys/hotkeysEvents.ts
export class HotkeysService {
    private isListening: boolean = false;
    private actions: HotkeyAction[] = [];

    addListeners(): void {
        if (this.isListening) {
            throw new Error("HotkeysService is already listening.");
        }

        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);

        this.isListening = true;
    }

    removeListeners(): void {
        if (!this.isListening) return;

        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);

        this.isListening = false;
    }

    register(opts: HotkeyOpts): HotkeyAction {
        const id = uuid();
        const combo = typeof opts.combo === "string" ? parseKeyCombo(opts.combo) : opts.combo;

        const action: HotkeyAction = {
            id,
            combo,
            onKeyDown: opts.onKeyDown,
            allowInInput: opts.allowInInput === true,
            preventDefault: opts.preventDefault === true,
            stopPropagation: opts.stopPropagation === true
        };

        this.actions.push(action);
        return action;
    }

    unregister(action: HotkeyAction): void {
        this.actions = this.actions.filter((a) => a.id !== action.id);
    }

    onKeyDown = (e: KeyboardEvent) => this.dispatch(e, "onKeyDown");

    onKeyUp = (e: KeyboardEvent) => this.dispatch(e, "onKeyUp");

    private dispatch(e: KeyboardEvent, eventType: "onKeyDown" | "onKeyUp"): void {
        const combo = getKeyCombo(e);
        const isInput = isTextInput(e);
        for (const action of this.actions) {
            const shouldIgnore = isInput && !action.allowInInput;
            if (!shouldIgnore && comboMatches(action.combo, combo)) {
                if (action.preventDefault) {
                    e.preventDefault();
                }
                if (action.stopPropagation) {
                    e.stopPropagation();
                }
                if (eventType === "onKeyDown") {
                    if (action.onKeyDown) action.onKeyDown();
                } else {
                    if (action.onKeyUp) action.onKeyUp();
                }
            }
        }
    }
}

export const hotkeysService = new HotkeysService();

// Reference source: @blueprintjs/core/src/components/hotkeys/hotkeysEvents.ts
function isTextInput(e: KeyboardEvent): boolean {
    const elem = e.target as HTMLElement;

    if (elem == null || elem.closest == null) {
        return false;
    }

    const editable = elem.closest("input, textarea, [contenteditable=true]");

    if (editable == null) {
        return false;
    }

    // don't let checkboxes, switches, and radio buttons prevent hotkey behavior
    if (editable.tagName.toLowerCase() === "input") {
        const inputType = (editable as HTMLInputElement).type;
        if (inputType === "checkbox" || inputType === "radio") {
            return false;
        }
    }

    // don't let read-only fields prevent hotkey behavior
    return !(editable as HTMLInputElement).readOnly;
}

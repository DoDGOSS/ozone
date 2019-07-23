import { WidgetInstanceId } from "../models/types";
import { IntentInstance } from "../models/Intent";

import { ImmerStore } from "./ImmerStore";

export interface IntentState {
    dialog: IntentDialogState;
}

export type IntentDialogState = IntentDialogHiddenState | IntentDialogVisibleState;

export interface IntentDialogHiddenState {
    isVisible: false;
}

export interface IntentDialogVisibleState extends ShowDialogOpts {
    isVisible: true;
}

export interface ShowDialogOpts {
    intent: IntentInstance;
    onSelected: (selectedIds: WidgetInstanceId[], remember: boolean) => void;
    onClosed: () => void;
}

const defaultState: IntentState = {
    dialog: {
        isVisible: false
    }
};

export class IntentStore extends ImmerStore<IntentState> {
    constructor(initialState?: IntentState) {
        super(initialState || defaultState);
    }

    showDialog(opts: ShowDialogOpts): void {
        this.next((state) => {
            state.dialog = Object.assign({ isVisible: true } as const, opts);
        });
    }

    hideDialog(): void {
        this.next((state) => {
            state.dialog = { isVisible: false };
        });
    }
}

export const intentStore = new IntentStore();

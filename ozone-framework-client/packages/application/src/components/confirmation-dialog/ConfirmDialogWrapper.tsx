import "./custom-style.scss";

import React from "react";
import { Button, Classes, Intent } from "@blueprintjs/core";
import { confirmAlert } from "react-confirm-alert";

import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";

import { buildStyledMessage, StyledString } from "./StyledString";

interface ConfirmDialogWrapperProps {
    onConfirm?: (value?: any) => void | undefined;
    onCancel?: () => void | undefined;
    innerUI: (closeDialog: () => void, onConfirm: (value?: any) => void, onCancel: () => void) => JSX.Element;
}

export const confirmDialogWrapper = (props: ConfirmDialogWrapperProps) => {
    // Timeouts are needed in order to chain confirmation dialogs
    // e.g.: showConfirmationDialog calls foo() on completion, which calls bar(), which calls another showConfirmationDialog
    // to check something else. Without the timeouts, that second dialog will never show.
    // tslint:disable:no-unused-variable
    const onConfirm: (value: any) => void = (value: any) => {
        setTimeout(() => {
            if (props.onConfirm) {
                props.onConfirm(value);
            }
        }, 1);
    };

    const onCancel: () => void = () => {
        setTimeout(() => {
            if (props.onCancel) {
                props.onCancel();
            }
        }, 1);
    };

    confirmAlert({
        onKeypressEscape: () => onCancel(),
        onClickOutside: () => onCancel(),
        customUI: ({ onClose }) => props.innerUI(onClose, onConfirm, onCancel) // note: misleading name! onClose actually closes dialog.
    });
};

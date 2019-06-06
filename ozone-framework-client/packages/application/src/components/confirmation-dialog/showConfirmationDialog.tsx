import "./custom-style.scss";

import React from "react";
import { Button, Classes, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";
import { confirmDialogWrapper } from "./ConfirmDialogWrapper";

import { buildStyledMessage, StyledString } from "./StyledString";

interface ShowConfirmationDialogProps {
    title: string;
    message: string | ((StyledString | string)[]);
    onConfirm?: () => void;
    onCancel?: () => void;
    hideCancel?: boolean;
    hideButtonIcons?: boolean;
    okButtonMessage?: string;
    cancelButtonMessage?: string;
    removeIntents?: boolean;
    extraButton?: boolean;
    extraButtonMessage?: string;
    onExtraButtonSelect?: () => any;
}

/**
 * Use by simply calling showConfirmationDialog, passing in:
 *  a title
 *  the message you want to show up
 *  and the function you want called if the user clicks 'OK'.
 *
 * Note! Newlines must be their own element. Newlines within a string of text are ignored.
 *
 * Example:
 * showConfirmationDialog({
 *     title: "Warning",
 *     message: [
 *         "This action will permanently delete: ",
 *         "\n",
 *         { text: "Some Widget", style: "bold" },
 *         " from your available widgets."],
 *     onConfirm: () => {
 *         this.someDeleteFunction();
 *     }
 * )
 *
 */
export const showConfirmationDialog = (props: ShowConfirmationDialogProps) => {
    let message: any = props.message;
    if (typeof props.message !== "string") {
        message = buildStyledMessage(props.message);
    }

    confirmDialogWrapper({
        onConfirm: props.onConfirm,
        onCancel: props.onCancel,
        innerUI: (closeDialog, onConfirm, onCancel) => {
            // must use these wrappers. If you use other functions, wrap them in a timeout.
            return (
                <div className={classNames(Classes.DIALOG, mainStore.themeClass().value)}>
                    <div className={Classes.DIALOG_HEADER}>{props.title}</div>
                    <div className={Classes.DIALOG_BODY}>{message}</div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => {
                                    onConfirm();
                                    closeDialog();
                                }}
                                intent={props.removeIntents ? undefined : Intent.SUCCESS}
                                rightIcon={props.hideButtonIcons ? undefined : "tick"}
                                data-element-id="confirmation-dialog-confirm"
                            >
                                {props.okButtonMessage ? props.okButtonMessage : "OK"}
                            </Button>
                            {props.extraButton && (
                                <Button
                                    onClick={() => {
                                        setTimeout(() => {
                                            if (props.onExtraButtonSelect) {
                                                // see note in ConfirmationDialogWrapper
                                                props.onExtraButtonSelect();
                                            }
                                        }, 1);
                                    }}
                                    intent={undefined}
                                    rightIcon={undefined}
                                    data-element-id="confirmation-extra-button"
                                >
                                    {props.extraButtonMessage ? props.extraButtonMessage : ""}
                                </Button>
                            )}
                            {!props.hideCancel && (
                                <Button
                                    onClick={() => {
                                        onCancel();
                                        closeDialog();
                                    }}
                                    intent={props.removeIntents ? undefined : Intent.DANGER}
                                    rightIcon={props.hideButtonIcons ? undefined : "cross"}
                                    data-element-id="confirmation-cancel"
                                >
                                    {props.cancelButtonMessage ? props.cancelButtonMessage : "Cancel"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    });
};

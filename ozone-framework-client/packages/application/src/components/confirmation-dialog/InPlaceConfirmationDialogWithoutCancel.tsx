import "./custom-style.scss";

import React from "react";
import { Button, Classes, Intent } from "@blueprintjs/core";
import { confirmAlert } from "react-confirm-alert";

import { buildStyledMessage, StyledString } from "./StyledString";

interface InPlaceConfirmationDialogWithoutCancelProps {
    title: string;
    message: string | ((StyledString | string)[]);
    onConfirm: () => void;
}

export const showConfirmationDialogWithoutCancel = (props: InPlaceConfirmationDialogWithoutCancelProps) => {
    const cancel = () => {
        return;
    };

    let message: any = props.message;
    if (typeof props.message !== "string") {
        message = buildStyledMessage(props.message);
    }

    confirmAlert({
        onKeypressEscape: () => cancel(),
        onClickOutside: () => cancel(),
        customUI: ({ onClose }) => {
            return (
                <div className={Classes.DIALOG}>
                    <div className={Classes.DIALOG_HEADER}>{props.title}</div>
                    <div className={Classes.DIALOG_BODY}>{message}</div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => {
                                    props.onConfirm();
                                    onClose();
                                }}
                                intent={Intent.SUCCESS}
                                rightIcon="tick"
                                data-element-id="confirmation-dialog-confirm"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    });
};

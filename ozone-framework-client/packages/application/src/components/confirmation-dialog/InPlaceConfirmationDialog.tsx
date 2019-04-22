import * as React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./custom-style.scss";

import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

interface InPlaceConfirmationDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const showConfirmationDialog = (props: InPlaceConfirmationDialogProps) => {
    let cancel = () => {
        return;
    };
    if (props.onCancel) {
        cancel = props.onCancel;
    }

    confirmAlert({
        onKeypressEscape: () => cancel(),
        onClickOutside: () => cancel(),
        customUI: ({ onClose }) => {
            return (
                <div className={Classes.DIALOG}>
                    <div className={Classes.DIALOG_HEADER}>{props.title}</div>
                    <div className={Classes.DIALOG_BODY}>{props.message}</div>
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
                            <Button
                                onClick={() => {
                                    cancel();
                                    onClose();
                                }}
                                intent={Intent.DANGER}
                                rightIcon="cross"
                                data-element-id="confirmation-cancel"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    });
};

import * as React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import "./custom-style.scss";
import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

interface StyledString {
    text: string;
    style: "" | "bold" | "italics" | "both";
}

interface InPlaceConfirmationDialogProps {
    title: string;
    message: string | ((StyledString | string)[]);
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

function buildStyledMessage(messageWithStyle: (StyledString | string)[]): any {
    return (
        <div>
            {(() => {
                const textPieces = [];
                let i: number = 0;
                for (const chunk of messageWithStyle) {
                    const style: { [key: string]: string } = {};
                    if (typeof chunk === "string") {
                        textPieces.push(<span key={i}>{chunk}</span>);
                    } else {
                        if (chunk.style === "bold") {
                            style["fontWeight"] = "bold";
                        }
                        if (chunk.style === "italics") {
                            style["fontStyle"] = "italic";
                        }
                        textPieces.push(
                            <span key={i} style={style}>
                                {chunk.text}
                            </span>
                        );
                    }
                    i++;
                }
                return textPieces;
            })()}
        </div>
    );
}

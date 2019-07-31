import React from "react";
import { Button, Classes, Intent } from "@blueprintjs/core";
import { confirmAlert } from "react-confirm-alert";
import ReactMarkdown from "react-markdown";

export interface AsyncDialogProps {
    title: string;
    text: string;

    confirmIntent?: Intent;
    confirmText?: string;

    cancelEnabled?: boolean;
    cancelIntent?: Intent;
}

export interface MarkdownConfirmationDialogProps extends AsyncDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const _MarkdownConfirmationDialog: React.FC<MarkdownConfirmationDialogProps> = (props) => {
    const confirmText = props.confirmText || "OK";
    const confirmIntent = props.confirmIntent || Intent.SUCCESS;
    const cancelIntent = props.cancelIntent || Intent.NONE;

    return (
        <div className={Classes.DIALOG}>
            <div className={Classes.DIALOG_HEADER}>
                <h4 className={Classes.HEADING}>{props.title}</h4>
            </div>
            <div className={Classes.DIALOG_BODY}>
                <ReactMarkdown source={props.text} />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        text={confirmText}
                        onClick={props.onConfirm}
                        intent={confirmIntent}
                        rightIcon="tick"
                        data-element-id="confirmation-dialog-confirm"
                    />
                    {props.cancelEnabled !== false && (
                        <Button text="Cancel" onClick={props.onCancel} intent={cancelIntent} rightIcon="cross" />
                    )}
                </div>
            </div>
        </div>
    );
};

export const MarkdownConfirmationDialog = React.memo(_MarkdownConfirmationDialog);

export function showMarkdownDialog(props: AsyncDialogProps): Promise<boolean> {
    return new Promise((resolve) => {
        confirmAlert({
            onKeypressEscape: () => resolve(false),
            onClickOutside: () => resolve(false),
            customUI: ({ onClose }) => (
                <MarkdownConfirmationDialog
                    {...props}
                    onCancel={() => {
                        resolve(false);
                        onClose();
                    }}
                    onConfirm={() => {
                        resolve(true);
                        onClose();
                    }}
                />
            )
        });
    });
}

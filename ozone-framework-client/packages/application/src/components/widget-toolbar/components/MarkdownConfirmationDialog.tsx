import React from "react";
import ReactMarkdown from "react-markdown";
import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

export interface MarkdownConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const _MarkdownConfirmationDialog: React.FC<MarkdownConfirmationDialogProps> = (props) => (
    <Dialog isOpen={props.isOpen} isCloseButtonShown={false} title={props.title} data-element-id="confirmation-dialog">
        <div className={Classes.DIALOG_BODY}>
            <ReactMarkdown source={props.text} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                    text="OK"
                    onClick={props.onConfirm}
                    intent={Intent.SUCCESS}
                    rightIcon="tick"
                    data-element-id="confirmation-dialog-confirm"
                />
                <Button
                    text="Cancel"
                    onClick={props.onCancel}
                    intent={Intent.DANGER}
                    rightIcon="cross"
                    data-element-id="confirmation-cancel"
                />
            </div>
        </div>
    </Dialog>
);

export const MarkdownConfirmationDialog = React.memo(_MarkdownConfirmationDialog);

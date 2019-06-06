import React, { useCallback } from "react";
import { useBehavior } from "../../../hooks";
import { Button, Classes, Intent } from "@blueprintjs/core";
import { confirmAlert } from "react-confirm-alert";

import { mainStore } from "../../../stores/MainStore";
import { classNames } from "../../../utility";

export interface ReplaceWidgetDialogProps {
    onConfirm?: () => void;
    onCancel?: () => void;
}

const _ReplaceWidgetDialog: React.FC<ReplaceWidgetDialogProps & { onClose: () => void }> = (props) => {
    const { onConfirm, onCancel, onClose } = props;

    const themeClass = useBehavior(mainStore.themeClass);

    const _onConfirm = useCallback(() => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    }, [onConfirm, onClose]);

    const _onCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    }, [onCancel, onClose]);

    return (
        <div className={classNames(Classes.DIALOG, themeClass)}>
            <div className={Classes.DIALOG_HEADER}>
                <header className={Classes.HEADING}>Confirm Replace Widget</header>
            </div>

            <div className={Classes.DIALOG_BODY} data-element-id="confirmation-dialog">
                <span>The current Widget will be closed and replaced with the new Widget. Continue?</span>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        text="OK"
                        rightIcon="tick"
                        intent={Intent.SUCCESS}
                        onClick={_onConfirm}
                        data-element-id="confirmation-dialog-confirm"
                    />
                    <Button
                        text="Cancel"
                        rightIcon="cross"
                        intent={Intent.DANGER}
                        onClick={_onCancel}
                        data-element-id="confirmation-cancel"
                    />
                </div>
            </div>
        </div>
    );
};

const ReplaceWidgetDialog = React.memo(_ReplaceWidgetDialog);

export function showReplaceWidgetDialog(props: ReplaceWidgetDialogProps): void {
    confirmAlert({
        closeOnClickOutside: false,
        closeOnEscape: false,
        customUI: ({ onClose }) => {
            return <ReplaceWidgetDialog onClose={onClose} {...props} />;
        }
    });
}

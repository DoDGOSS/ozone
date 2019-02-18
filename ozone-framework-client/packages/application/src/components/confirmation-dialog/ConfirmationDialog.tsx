import * as React from "react";

import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

interface ConfirmationDialogProps {
    show: boolean;
    title: string;
    content: string;
    confirmHandler: (payload: any) => void;
    cancelHandler: (payload: any) => void;
    payload: any;
}

export const ConfirmationDialog: React.FunctionComponent<ConfirmationDialogProps> = (props) => {
    return (
        <div>
            <Dialog
                isOpen={props.show}
                isCloseButtonShown={false}
                title={props.title}
                data-element-id="confirmation-dialog"
            >
                <div className={Classes.DIALOG_BODY} dangerouslySetInnerHTML={{ __html: props.content }} />

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            onClick={() => props.confirmHandler(props.payload)}
                            intent={Intent.SUCCESS}
                            rightIcon="tick"
                            data-element-id="confirmation-dialog-confirm"
                        >
                            OK
                        </Button>
                        <Button
                            onClick={() => props.cancelHandler(props.payload)}
                            intent={Intent.DANGER}
                            rightIcon="cross"
                            data-element-id="confirmation-cancel"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

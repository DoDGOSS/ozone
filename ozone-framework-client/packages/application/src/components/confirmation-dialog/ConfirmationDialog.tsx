// import * as styles from "./ConfirmationDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

interface ConfirmationDialogProps {
    show: boolean;
    title: string;
    content: string;
    confirmHandler: (payload: any) => void;
    cancelHandler: (payload: any) => void;
    payload: any;
}

@observer
export class ConfirmationDialog extends React.Component<ConfirmationDialogProps> {
    render() {
        return (
            <div>
                <Dialog
                    isOpen={this.props.show}
                    isCloseButtonShown={false}
                    title={this.props.title}
                    data-element-id="confirmation-dialog"
                >
                    <div className={Classes.DIALOG_BODY} dangerouslySetInnerHTML={{ __html: this.props.content }} />

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={this.handleConfirm}
                                intent={Intent.SUCCESS}
                                rightIcon="tick"
                                data-element-id="confirmation-dialog-confirm"
                            >
                                OK
                            </Button>
                            <Button
                                onClick={this.handleCancel}
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
    }

    handleConfirm = (event: React.MouseEvent<HTMLElement>) => {
        this.props.confirmHandler(this.props.payload);
    };

    handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        this.props.cancelHandler(this.props.payload);
    };
}

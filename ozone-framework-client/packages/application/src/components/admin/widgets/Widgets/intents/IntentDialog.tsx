import * as React from "react";

import { Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../../../../utility";
import { Intent } from "../../../../../models/compat";

import { IntentForm } from "./IntentForm";

import * as styles from "../../Widgets.scss";

export interface IntentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: any) => void;
    intentToEdit?: Intent;
}

export class IntentDialog extends React.Component<IntentDialogProps, {}> {
    render() {
        return (
            <Dialog
                title={this.getTitle()}
                className={classNames("bp3-dark", styles.dialog)}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
            >
                <div className={classNames(Classes.DIALOG_BODY, styles.dialogBody)}>
                    <IntentForm
                        intentToEdit={this.props.intentToEdit}
                        onSubmit={(newI: any) => {
                            this.props.onSubmit(newI);
                            this.props.onClose();
                        }}
                    />
                </div>
            </Dialog>
        );
    }

    private getTitle(): string {
        if (this.props.intentToEdit) {
            return "Edit Intent";
        }
        return "Create Intent";
    }
}

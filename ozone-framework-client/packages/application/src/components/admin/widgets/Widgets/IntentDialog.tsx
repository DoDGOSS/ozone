import * as styles from "../Widgets.scss";

import * as React from "react";

import { Dialog } from "@blueprintjs/core";

import { Intent } from "../../../../models/compat";

import { IntentForm } from "./IntentForm";
import { mainStore } from "../../../../stores/MainStore";
import { classNames } from "../../../../utility";

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
                className={classNames(styles.createIntent,mainStore.getTheme())}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
            >
                <div>
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

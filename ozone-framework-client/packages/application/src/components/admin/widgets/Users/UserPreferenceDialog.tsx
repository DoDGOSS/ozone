import * as React from "react";

import { Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../../../utility";
import { mainStore } from "../../../../stores/MainStore";

import { UserPreferenceForm } from "./UserPreferenceForm";
import { PreferenceUpdateRequest } from "../../../../api/models/PreferenceDTO";

import * as styles from "../Widgets.scss";

export interface PreferenceDialogProps {
    isOpen: boolean;
    onSubmit: (e: any) => void;
    onClose: () => void;
    preferenceToEdit?: PreferenceUpdateRequest | undefined;
}

export class UserPreferenceDialog extends React.Component<PreferenceDialogProps, {}> {
    render() {
        return (
            <Dialog
                title={this.getTitle()}
                className={classNames(styles.dialog, mainStore.getTheme())}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
            >
                <div
                    data-element-id={"user-admin-preference-dialog"}
                    className={classNames(Classes.DIALOG_BODY, styles.dialogBody)}
                >
                    <UserPreferenceForm
                        preferenceToEdit={this.props.preferenceToEdit}
                        onSubmit={(newP: any) => {
                            this.props.onSubmit(newP);
                            this.props.onClose();
                        }}
                        onClose={this.props.onClose}
                    />
                </div>
            </Dialog>
        );
    }

    private getTitle(): string {
        if (this.props.preferenceToEdit) {
            return "Edit Preference";
        }
        return "Create Preference";
    }
}

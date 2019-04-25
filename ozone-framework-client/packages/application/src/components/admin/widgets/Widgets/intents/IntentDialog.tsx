import * as React from "react";

import { Classes, Dialog } from "@blueprintjs/core";

<<<<<<< HEAD:ozone-framework-client/packages/application/src/components/admin/widgets/Widgets/intents/IntentDialog.tsx
import { classNames } from "../../../../../utility";
import { Intent } from "../../../../../models/compat";
=======
import { Intent } from "../../../../models/compat";
>>>>>>> 2d2054733184e6a2ed8ae31b2419bc68cce911bd:ozone-framework-client/packages/application/src/components/admin/widgets/Widgets/IntentDialog.tsx

import { IntentForm } from "./IntentForm";
import { mainStore } from "../../../../stores/MainStore";
import { classNames } from "../../../../utility";

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
                className={classNames(styles.createIntent,mainStore.getTheme())}
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

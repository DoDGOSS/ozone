import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";

import { CONFIRMATION_DIALOG } from "../../messages";


const DEFAULT_PROPS = {
    title: CONFIRMATION_DIALOG.title,
    content: CONFIRMATION_DIALOG.content,
    confirm: CONFIRMATION_DIALOG.confirm,
    cancel:CONFIRMATION_DIALOG.cancel
};

export type ConfirmationProps = Readonly<typeof DEFAULT_PROPS>;

@observer
export class ConfirmationDialog extends React.Component<ConfirmationProps> {

    static defaultProps = DEFAULT_PROPS;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    render() {
        const { title, content, confirm, cancel } = this.props;

        return (
            <div>
                <Dialog className={this.mainStore.darkClass}
                        isOpen={this.mainStore.isConfirmationDialogVisible}
                        onClose={this.mainStore.hideConfirmationDialogCancel}
                        isCloseButtonShown={true}
                        title={title}>

                    <div data-element-id='confirmation-dialog'
                         className={Classes.DIALOG_BODY}
                         dangerouslySetInnerHTML={{ __html: content }}/>

                    <div className={Classes.DIALOG_FOOTER}>

                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.mainStore.hideConfirmationDialogConfirm}
                                intent={Intent.SUCCESS}
                                rightIcon="tick"
                                data-element-id='confirmation-dialog-confirm'>
                            {CONFIRMATION_DIALOG.confirm.text}
                        </Button>
                        <Button onClick={this.mainStore.hideConfirmationDialogCancel}
                                intent={Intent.DANGER}
                                rightIcon="cross"
                                data-element-id='confirmation-cancel'>
                            {CONFIRMATION_DIALOG.cancel.text}
                        </Button>
                        </div>

                    </div>

                </Dialog>
            </div>
        );
    }

}

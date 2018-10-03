import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog, IconName, Intent } from "@blueprintjs/core";

import { MainStore } from "../MainStore";
import { WARNING_DIALOG } from "../../messages";


export type WarningDialogProps = {
    store: MainStore;
} & WarningDialogDefaultProps;

export type WarningDialogDefaultProps = Readonly<typeof DEFAULT_PROPS>

const DEFAULT_PROPS = {
    title: WARNING_DIALOG.title,
    content: WARNING_DIALOG.content,
    buttonIcon: WARNING_DIALOG.button.icon as IconName,
    buttonText: WARNING_DIALOG.button.text
};

@observer
export class WarningDialog extends React.PureComponent<WarningDialogProps> {

    public static defaultProps = DEFAULT_PROPS;

    public render() {
        const { store, title, content, buttonText, buttonIcon } = this.props;

        return (
            <div>
                <Dialog isOpen={store.isWarningDialogVisible}
                        isCloseButtonShown={false}
                        title={title}>

                    <div className={Classes.DIALOG_BODY}
                         dangerouslySetInnerHTML={{ __html: content }}/>

                    <div className={Classes.DIALOG_FOOTER}>

                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={store.hideWarningDialog}
                                    intent={Intent.SUCCESS}
                                    rightIcon={buttonIcon}>
                                {buttonText}
                            </Button>
                        </div>

                    </div>

                </Dialog>
            </div>
        )
    }

}

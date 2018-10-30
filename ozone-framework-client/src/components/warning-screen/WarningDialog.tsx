import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog, IconName, Intent } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";

import { WARNING_DIALOG } from "../../messages";


const DEFAULT_PROPS = {
    title: WARNING_DIALOG.title,
    content: WARNING_DIALOG.content,
    buttonIcon: WARNING_DIALOG.button.icon as IconName,
    buttonText: WARNING_DIALOG.button.text
};

export type WarningDialogProps = Readonly<typeof DEFAULT_PROPS>;

@observer
export class WarningDialog extends React.Component<WarningDialogProps> {

    static defaultProps = DEFAULT_PROPS;

    @inject(MainStore)
    private mainStore: MainStore;

    render() {
        const { title, content, buttonText, buttonIcon } = this.props;

        return (
            <div>
                <Dialog isOpen={this.mainStore.isWarningDialogVisible}
                        isCloseButtonShown={false}
                        title={title}>

                    <div className={Classes.DIALOG_BODY}
                         dangerouslySetInnerHTML={{ __html: content }}/>

                    <div className={Classes.DIALOG_FOOTER}>

                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.mainStore.hideWarningDialog}
                                    intent={Intent.SUCCESS}
                                    rightIcon={buttonIcon}>
                                {buttonText}
                            </Button>
                        </div>

                    </div>

                </Dialog>
            </div>
        );
    }

}

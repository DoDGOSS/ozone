import * as React from "react";

import { Button, Classes, Dialog, IconName, Intent } from "@blueprintjs/core";

import { WARNING_DIALOG } from "../messages";


export type WarningDialogProps = {
    isOpen: boolean;
    onClose: () => void;
} & WarningDialogDefaultProps;


export type WarningDialogDefaultProps = Readonly<typeof DEFAULT_PROPS>


const DEFAULT_PROPS = {
    title: WARNING_DIALOG.title,
    content: WARNING_DIALOG.content,
    buttonIcon: WARNING_DIALOG.button.icon as IconName,
    buttonText: WARNING_DIALOG.button.text
};


export class WarningDialog extends React.PureComponent<WarningDialogProps> {

    public static defaultProps = DEFAULT_PROPS;

    public render() {
        const { title, content, buttonText, buttonIcon, isOpen, onClose } = this.props;

        return (
            <div>
                <Dialog isOpen={isOpen}
                        title={title}>

                    <div className={Classes.DIALOG_BODY}
                         dangerouslySetInnerHTML={{ __html: content }}/>

                    <div className={Classes.DIALOG_FOOTER}>

                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={onClose}
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

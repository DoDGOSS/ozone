import * as React from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, Dialog, IconName, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";

import { WARNING_DIALOG } from "../../messages";

import { defaults } from "lodash";

const DEFAULT_PROPS = {
    title: WARNING_DIALOG.title,
    content: WARNING_DIALOG.content,
    link: WARNING_DIALOG.link,
    buttonIcon: WARNING_DIALOG.button.icon as IconName,
    buttonText: WARNING_DIALOG.button.text
};

export type WarningDialogProps = Partial<typeof DEFAULT_PROPS>;

export const WarningDialog: React.FC<WarningDialogProps> = (props) => {
    const { title, content, link, buttonText, buttonIcon } = defaults({}, props, DEFAULT_PROPS);

    const isOpen = useBehavior(mainStore.isWarningDialogVisible);
    const themeClass = useBehavior(mainStore.themeClass);

    return (
        <div>
            <Dialog className={themeClass} isOpen={isOpen} isCloseButtonShown={false} title={title}>
                <div className={Classes.DIALOG_BODY}>
                    <div data-element-id="warning-dialog" dangerouslySetInnerHTML={{ __html: content }} />
                    <a
                        data-element-id="user-agreement-link"
                        className={Classes.DIALOG_BODY}
                        onClick={() => {
                            mainStore.hideWarningDialog();
                            mainStore.showUserAgreement();
                        }}
                    >
                        {link}
                    </a>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            data-element-id="form-accept-button"
                            onClick={() => {
                                mainStore.hideWarningDialog();
                                mainStore.showLoginDialog();
                            }}
                            intent={Intent.SUCCESS}
                            rightIcon={buttonIcon}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

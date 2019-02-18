import * as React from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, Dialog, IconName, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";

import { classNames } from "../../utility";
import { defaults } from "lodash";

import { USER_AGREEMENT_DIALOG } from "../../messages";

import * as styles from "./index.scss";

const DEFAULT_PROPS = {
    title: USER_AGREEMENT_DIALOG.title,
    content: USER_AGREEMENT_DIALOG.content,
    buttonIcon: USER_AGREEMENT_DIALOG.button.icon as IconName,
    buttonText: USER_AGREEMENT_DIALOG.button.text
};

export type UserAgreementProps = Partial<typeof DEFAULT_PROPS>;

export const UserAgreement: React.FunctionComponent<UserAgreementProps> = (props) => {
    const { title, content, buttonText, buttonIcon } = defaults({}, props, DEFAULT_PROPS);

    const isOpen = useBehavior(mainStore.isUserAgreementVisible);

    return (
        <div>
            <Dialog className="bp3-dark" isOpen={isOpen} isCloseButtonShown={false} title={title}>
                <div className="agreement">
                    <div
                        data-element-id="user-agreement-dialog"
                        className={classNames(styles.agreement, Classes.DIALOG_BODY)}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            data-element-id="back-button"
                            onClick={() => {
                                mainStore.hideUserAgreement();
                                mainStore.showWarningDialog();
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

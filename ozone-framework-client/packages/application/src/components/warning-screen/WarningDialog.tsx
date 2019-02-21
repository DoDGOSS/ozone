import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog, IconName, Intent } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";

import { USER_AGREEMENT_DIALOG, WARNING_DIALOG } from "../../messages";

import * as Styles from "./WarningDialog.scss";
import { classNames } from "../util";

const DEFAULT_PROPS = {
    title: WARNING_DIALOG.title,
    content: WARNING_DIALOG.content,
    link: WARNING_DIALOG.link,
    buttonIcon: WARNING_DIALOG.button.icon as IconName,
    buttonText: WARNING_DIALOG.button.text
};

const USER_AGREEMENT_PROPS = {
    title: USER_AGREEMENT_DIALOG.title,
    content: USER_AGREEMENT_DIALOG.content,
    buttonIcon: USER_AGREEMENT_DIALOG.button.icon as IconName,
    buttonText: USER_AGREEMENT_DIALOG.button.text
};

export type WarningDialogProps = Readonly<typeof DEFAULT_PROPS>;

export type UserAgreementProps = Readonly<typeof USER_AGREEMENT_PROPS>;

@observer
export class WarningDialog extends React.Component<WarningDialogProps> {
    static defaultProps = DEFAULT_PROPS;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    render() {
        const { title, content, link, buttonText, buttonIcon } = this.props;

        return (
            <div>
                <Dialog
                    className="bp3-dark"
                    isOpen={this.mainStore.isWarningDialogVisible}
                    isCloseButtonShown={false}
                    title={title}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <div data-element-id="warning-dialog" dangerouslySetInnerHTML={{ __html: content }} />
                        <a
                            data-element-id="user-agreement-link"
                            className={Classes.DIALOG_BODY}
                            onClick={() => {
                                this.mainStore.hideWarningDialog();
                                this.mainStore.showUserAgreement();
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
                                    this.mainStore.hideWarningDialog();
                                    this.mainStore.showLoginDialog();
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
    }
}

@observer
export class UserAgreement extends React.Component<UserAgreementProps> {
    static defaultProps = USER_AGREEMENT_PROPS;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    render() {
        const { title, content, buttonText, buttonIcon } = this.props;

        return (
            <div>
                <Dialog
                    className="bp3-dark"
                    isOpen={this.mainStore.isUserAgreementVisible}
                    isCloseButtonShown={false}
                    title={title}
                >
                    <div className="agreement">
                        <div
                            data-element-id="user-agreement-dialog"
                            className={classNames(Styles.agreement, Classes.DIALOG_BODY)}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                data-element-id="back-button"
                                onClick={() => {
                                    this.mainStore.hideUserAgreement();
                                    this.mainStore.showWarningDialog();
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
    }
}

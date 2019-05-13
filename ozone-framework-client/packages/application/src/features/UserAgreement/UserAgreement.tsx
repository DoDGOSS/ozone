import React from "react";
import { Button, Intent } from "@blueprintjs/core";

import { MarkdownDialog } from "../../shared/components/MarkdownDialog/MarkdownDialog";

import { UserAgreementOptions } from "../../environment";

export interface UserAgreementProps {
    opts: UserAgreementOptions;
    isOpen: boolean;
    onClose: () => void;
}

export const UserAgreement: React.FC<UserAgreementProps> = (props) => {
    const { opts } = props;

    return (
        <MarkdownDialog
            testId="user-agreement"
            title={opts.title}
            content={opts.message}
            isOpen={props.isOpen}
            actions={
                <Button
                    data-test-id="user-agreement-back-button"
                    text="Back"
                    intent={Intent.SUCCESS}
                    rightIcon="undo"
                    onClick={props.onClose}
                />
            }
        />
    );
};

import React from "react";
import { Button, Intent } from "@blueprintjs/core";

import { MarkdownDialog } from "../../shared/components/MarkdownDialog/MarkdownDialog";

export interface UserAgreementOptions {
    title: string;
    message: string;
}

export interface UserAgreementProps {
    opts: UserAgreementOptions;
    isOpen: boolean;
    onClose: () => void;
}

export const UserAgreement: React.FC<UserAgreementProps> = (props) => {
    const { opts } = props;

    return (
        <MarkdownDialog
            title={opts.title}
            content={opts.message}
            isOpen={props.isOpen}
            actions={<Button text="Back" intent={Intent.SUCCESS} rightIcon="undo" onClick={props.onClose} />}
        />
    );
};

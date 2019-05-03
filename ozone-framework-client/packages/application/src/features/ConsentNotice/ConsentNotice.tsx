import styles from "./index.module.scss";

import React from "react";
import { AnchorButton, Intent } from "@blueprintjs/core";

import { MarkdownDialog } from "../../shared/components/MarkdownDialog/MarkdownDialog";

export interface ConsentNoticeOptions {
    title: string;
    message: string;
    details: {
        isEnabled: boolean;
        linkText: string;
    };
    nextUrl: string;
}

export interface ConsentNoticeProps {
    opts: ConsentNoticeOptions;
    isOpen: boolean;
    showUserAgreement: () => void;
}

export const ConsentNotice: React.FC<ConsentNoticeProps> = (props) => {
    const { opts } = props;

    return (
        <MarkdownDialog
            title={opts.title}
            content={opts.message}
            isOpen={props.isOpen}
            additionalContent={
                opts.details.isEnabled && (
                    <a className={styles.agreementLink} onClick={props.showUserAgreement}>
                        {opts.details.linkText}
                    </a>
                )
            }
            actions={<AnchorButton text="Accept" intent={Intent.SUCCESS} rightIcon="tick" href={opts.nextUrl} />}
        />
    );
};

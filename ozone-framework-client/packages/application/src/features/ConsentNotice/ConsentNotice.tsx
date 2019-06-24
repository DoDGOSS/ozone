import styles from "./index.module.scss";

import React, { useMemo } from "react";
import { AnchorButton, Button, Intent } from "@blueprintjs/core";

import { MarkdownDialog } from "../../shared/components/MarkdownDialog/MarkdownDialog";

import { consentNextUrl, ConsentNoticeOptions } from "../../environment";

export interface ConsentNoticeProps {
    opts: ConsentNoticeOptions;
    isOpen: boolean;
    showUserAgreement: () => void;
    onAccept?: () => void;
}

export const ConsentNotice: React.FC<ConsentNoticeProps> = (props) => {
    const { onAccept, opts } = props;

    const acceptButton = useMemo(() => {
        if (onAccept) {
            return <Button text="Accept" intent={Intent.SUCCESS} rightIcon="tick" onClick={onAccept} />;
        }
        return <AnchorButton text="Accept" intent={Intent.SUCCESS} rightIcon="tick" href={consentNextUrl()} />;
    }, [onAccept]);

    const userAgreementLink = useMemo(() => {
        if (!opts.details.isEnabled) return undefined;

        return (
            <a className={styles.agreementLink} onClick={props.showUserAgreement}>
                {opts.details.linkText}
            </a>
        );
    }, [opts, props.showUserAgreement]);

    return (
        <MarkdownDialog
            testId="consent-notice"
            title={opts.title}
            content={opts.message}
            isOpen={props.isOpen}
            additionalContent={userAgreementLink}
            actions={acceptButton}
        />
    );
};

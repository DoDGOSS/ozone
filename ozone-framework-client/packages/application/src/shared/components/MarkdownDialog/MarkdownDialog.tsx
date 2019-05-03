import styles from "./index.module.scss";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Classes, Dialog } from "@blueprintjs/core";

export interface MarkdownDialogProps {
    actions?: React.ReactNode;
    additionalContent?: React.ReactNode;
    content: string;
    isOpen: boolean;
    title: string;
}

export const MarkdownDialog: React.FC<MarkdownDialogProps> = (props) => (
    <Dialog className={`bp3-dark ${styles.root}`} isOpen={props.isOpen} isCloseButtonShown={false} title={props.title}>
        <div className={`${Classes.DIALOG_BODY} ${styles.content}`}>
            <ReactMarkdown source={props.content} />
            {props.additionalContent}
        </div>
        <div className={`${Classes.DIALOG_FOOTER} ${styles.footer}`}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>{props.actions}</div>
        </div>
    </Dialog>
);

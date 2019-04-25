import * as React from "react";

import { Classes, Dialog } from "@blueprintjs/core";

import { ABOUT } from "../../messages";

import { defaults } from "lodash";
import { mainStore } from "../../stores/MainStore";
import { useBehavior } from "../../hooks";

const DEFAULT_PROPS = {
    title: ABOUT.title,
    content: ABOUT.content,
    version: ABOUT.version
};

export type AboutProps = Partial<typeof DEFAULT_PROPS> & {
    isVisible: boolean;
    onClose: () => void;
};

export const AboutDialog: React.FC<AboutProps> = (props) => {
    const { content, isVisible, onClose, title, version } = defaults({}, props, DEFAULT_PROPS);
    const themeClass = useBehavior(mainStore.themeClass);

    return (
        <div>
            <Dialog className={themeClass} isOpen={isVisible} onClose={onClose} isCloseButtonShown={true} title={title}>
                <div
                    data-element-id="about-dialog"
                    className={Classes.DIALOG_BODY}
                    dangerouslySetInnerHTML={{ __html: content || ABOUT.content }}
                />

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>{version}</div>
                </div>
            </Dialog>
        </div>
    );
};

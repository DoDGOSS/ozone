import * as React from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { dashboardService } from "../../stores/DashboardService";

import { defaults } from "lodash";

import { CONFIRMATION_DIALOG } from "../../messages";

const DEFAULT_PROPS = {
    title: CONFIRMATION_DIALOG.title,
    content: CONFIRMATION_DIALOG.content,
    confirm: CONFIRMATION_DIALOG.confirm,
    cancel: CONFIRMATION_DIALOG.cancel
};

export type ConfirmationProps = Partial<typeof DEFAULT_PROPS>;

export const ReplaceWidgetDialog: React.FC<ConfirmationProps> = (props) => {
    const { title, content, confirm, cancel } = defaults({}, props, DEFAULT_PROPS);

    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(dashboardService.isConfirmationDialogVisible);

    return (
        <div>
            <Dialog
                className={themeClass}
                isOpen={isOpen}
                onClose={dashboardService.cancelReplaceWidget}
                isCloseButtonShown={true}
                title={title}
            >
                <div
                    data-element-id="confirmation-dialog"
                    className={Classes.DIALOG_BODY}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            onClick={dashboardService.confirmReplaceWidget}
                            intent={Intent.SUCCESS}
                            rightIcon="tick"
                            data-element-id="confirmation-dialog-confirm"
                        >
                            {confirm.text}
                        </Button>
                        <Button
                            onClick={dashboardService.cancelReplaceWidget}
                            intent={Intent.DANGER}
                            rightIcon="cross"
                            data-element-id="confirmation-cancel"
                        >
                            {cancel.text}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

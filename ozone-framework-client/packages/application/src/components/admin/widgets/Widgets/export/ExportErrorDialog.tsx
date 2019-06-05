import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import * as React from "react";

import { WidgetDTO } from "../../../../../api/models/WidgetDTO";

export interface ExportErrorDialogProps {
    widget: WidgetDTO;
    onClose: () => void;
}

export const ExportErrorDialog: React.FC<ExportErrorDialogProps> = (props) => {
    return (
        <div>
            <Dialog
                isOpen={true}
                isCloseButtonShown={false}
                onClose={props.onClose}
                canOutsideClickClose={false}
                title="Server Error!"
                data-element-id="export-error-dialog"
            >
                <div className={Classes.DIALOG_BODY}>The export of widget {props.widget.value.namespace} failed.</div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            onClick={props.onClose}
                            intent={Intent.SUCCESS}
                            rightIcon="tick"
                            data-element-id="export-error-dialog-confirm"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

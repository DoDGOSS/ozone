import "./HelpDialog.css";

import * as React from "react";
import { observer } from "mobx-react";
import * as classNames from "classnames";

import { Classes, Dialog } from "@blueprintjs/core";

import { MainStore } from "../MainStore";


export type HelpDialogProps = {
    store: MainStore
}

@observer
export class HelpDialog extends React.Component<HelpDialogProps> {

    public render() {
        const { store } = this.props;

        return (
            <Dialog className="help-dialog"
                    title="Help"
                    icon="help"
                    isOpen={store.isHelpDialogVisible}
                    onClose={store.hideHelpDialog}>

                <div className={classNames(Classes.DIALOG_BODY, "help-content")}>
                    <p>Lorem ipsum...</p>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}/>
                </div>

            </Dialog>
        )
    }

}

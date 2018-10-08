import * as styles from "./HelpDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog } from "@blueprintjs/core";

import { MainStore } from "../MainStore";
import { classNames } from "../util";


export type HelpDialogProps = {
    store: MainStore
}

@observer
export class HelpDialog extends React.Component<HelpDialogProps> {

    public render() {
        const { store } = this.props;

        return (
            <Dialog className={styles.helpDialog}
                    title="Help"
                    icon="help"
                    isOpen={store.isHelpDialogVisible}
                    onClose={store.hideHelpDialog}>

                <div className={classNames(Classes.DIALOG_BODY, styles.helpContent)}>
                    <p>Lorem ipsum...</p>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}/>
                </div>

            </Dialog>
        )
    }

}

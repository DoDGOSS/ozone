import * as styles from "./HelpDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";

import { classNames } from "../util";


@observer
export class HelpDialog extends React.Component {

    @inject(MainStore)
    private mainStore: MainStore;

    render() {
        return (
            <Dialog className={styles.helpDialog}
                    title="Help"
                    icon="help"
                    isOpen={this.mainStore.isHelpDialogVisible}
                    onClose={this.mainStore.hideHelpDialog}>

                <div className={classNames(Classes.DIALOG_BODY, styles.helpContent)}>
                    <p>Lorem ipsum...</p>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}/>
                </div>

            </Dialog>
        );
    }

}

import * as styles from "./LoginDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";

import { LoginForm } from "./LoginForm";

@observer
export class LoginDialog extends React.Component {

    @inject(MainStore)
    private mainStore: MainStore;

    render() {
        return (
            <div>
                <Dialog className={styles.loginDialog}
                        isOpen={this.mainStore.isLoginDialogOpen}
                        onClose={this.mainStore.hideLoginDialog}
                        title="Login"
                        icon="log-in">

                    <div className={Classes.DIALOG_BODY}>
                        <div className={styles.tileContainer}>
                            <LoginForm/>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

}

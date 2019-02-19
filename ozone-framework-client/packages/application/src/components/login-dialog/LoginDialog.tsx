import * as styles from "./LoginDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";

import { LoginForm } from "./LoginForm";

const loginDialogStyles = {
    minHeight: "400px"
};

const dialogBody = {
    display: "flex",
    justifyContent: "center"
};

@observer
export class LoginDialog extends React.Component {
    @lazyInject(MainStore)
    private mainStore: MainStore;

    @action.bound
    submitLogin() {
        this.mainStore.hideWarningDialog();
        this.mainStore.hideLoginDialog();
        window.location.reload();
    }

    render() {
        return (
            <div>
                <Dialog
                    className="bp3-dark"
                    isOpen={this.mainStore.isLoginDialogOpen}
                    onClose={this.mainStore.hideLoginDialog}
                    title="Login"
                    icon="log-in"
                    style={loginDialogStyles}
                >
                    <div className={Classes.DIALOG_BODY} data-element-id="login-dialog" style={dialogBody}>
                        <div className={styles.tileContainer}>
                            <LoginForm onSuccess={this.submitLogin} />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

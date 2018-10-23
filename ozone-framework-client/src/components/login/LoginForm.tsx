import * as styles from "./LoginForm.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";

interface State {
    username: string;
    password: string;
    submitted: boolean;
}

@observer
export class LoginDialog extends React.Component<{}, State> {

    @inject(MainStore)
    private mainStore: MainStore;

    constructor(props: {}) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e: any) {
        e.preventDefault();
        this.setState({
            username: "test",
            password: "test",
            submitted: true
        })
    }

    render() {
        console.log(this.state)
        return (
            <div>

                <Dialog className={styles.loginDialog}
                        isOpen={this.mainStore.isLoginDialogOpen}
                        onClose={this.mainStore.hideLoginDialog}
                        title="Login Page"
                        icon="wrench">

                    <div className={Classes.DIALOG_BODY}>
                        <div className={styles.tileContainer}>
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <InputGroup className={styles.InputField} id="username" placeholder="username" />
                                    <br/>
                                    <InputGroup className={styles.InputField} id="password" placeholder="password" />
                                    <br/>
                                    <Button type="submit" text="Login" />
                                </FormGroup>
                            </form>
                        </div>
                    </div>

                </Dialog>

            </div>
        )
    }

}

export { LoginDialog as LoginForm };
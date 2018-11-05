import * as styles from "./UserProfileDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog, Menu } from "@blueprintjs/core";

import { inject } from "../../inject";
import { ConfigStore, MainStore } from "../../stores";

import { classNames } from "../util";


@observer
export class UserProfileDialog extends React.Component {

    @inject(MainStore)
    private mainStore: MainStore;

    @inject(ConfigStore)
    private configStore: ConfigStore;

    render() {

        return (
            <Dialog className={styles.userProfileDialog}
                    title="Profile"
                    icon="wrench"
                    isOpen={this.mainStore.isUserProfileDialogVisible}
                    onClose={this.mainStore.hideUserProfileDialog}>
                <div className={classNames(styles.title)}>User Information</div>
                <div className={classNames(Classes.DIALOG_BODY, styles.userProfileDialogContent)}>
                    <p>User Name: {this.configStore.userDisplayName}</p>
                    <p>Full Name: {this.configStore.userDisplayName}</p>
                    <p>Email: {this.configStore.userDisplayName}</p>
                    <p>Member Of: {this.configStore.groups}</p>
                </div>
                <Menu.Divider/>
                <div className={classNames(styles.title)}>User Preferences</div>
                <div><input id="animations" type="checkbox" /> Enable Animations</div>
                <div><input id="hints" type="checkbox" /> Enable Hints</div>
            </Dialog>
        )
    }

}

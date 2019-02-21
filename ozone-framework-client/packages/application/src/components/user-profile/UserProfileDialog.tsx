import * as styles from "./UserProfileDialog.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { AuthStore, MainStore } from "../../stores";

import { classNames } from "../util";

@observer
export class UserProfileDialog extends React.Component {
    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    render() {
        const user = this.authStore.user;

        return (
            <Dialog
                className={classNames(styles.userProfileDialog, this.mainStore.darkClass)}
                title="Profile"
                icon="wrench"
                isOpen={this.mainStore.isUserProfileDialogVisible}
                onClose={this.mainStore.hideUserProfileDialog}
            >
                <div className={Classes.DIALOG_BODY}>
                    <DataSection title="User Information">
                        <DataItem label="Username:">{user ? user.username : ""}</DataItem>
                        <DataItem label="Full Name:">{user ? user.userRealName : ""}</DataItem>
                        <DataItem label="E-mail:">{user ? user.email : ""}</DataItem>
                        <DataItem label="Groups:">
                            {user ? user.groups.map((group) => group.displayName).join(", ") : ""}
                        </DataItem>
                    </DataSection>

                    <DataSection title="User Preferences">
                        <DataItem label="Enable Animations:">
                            <input id="animations" type="checkbox" />
                        </DataItem>
                        <DataItem label="Enable Hints:">
                            <input id="hints" type="checkbox" />
                        </DataItem>
                    </DataSection>
                </div>
            </Dialog>
        );
    }
}

interface DataSectionProps {
    title: string;
    children?: React.ReactNode;
}

const DataSection: React.FunctionComponent<DataSectionProps> = ({ title, children }) => (
    <div className={styles.dataSection}>
        <header>{title}</header>
        <div className={styles.dataGrid}>{children}</div>
    </div>
);

interface DataItemProps {
    label: string;
    children?: React.ReactNode;
}

const DataItem: React.FunctionComponent<DataItemProps> = ({ label, children }) => (
    <>
        <label>{label}</label>
        <span>{children}</span>
    </>
);

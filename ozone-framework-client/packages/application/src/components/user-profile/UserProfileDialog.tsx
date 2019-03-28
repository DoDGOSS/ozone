import * as React from "react";

import { Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../utility";

import * as styles from "./index.scss";
import { useBehavior } from "../../hooks";
import { authStore } from "../../stores/AuthStore";
import { mainStore } from "../../stores/MainStore";

export const UserProfileDialog: React.FC = () => {
    const themeClass = useBehavior(mainStore.themeClass);

    const user = useBehavior(authStore.user);

    const isOpen = useBehavior(mainStore.isUserProfileDialogVisible);
    const onClose = mainStore.hideUserProfileDialog;

    return (
        <Dialog
            className={classNames(themeClass, styles.userProfileDialog)}
            title="Profile"
            icon="wrench"
            isOpen={isOpen}
            onClose={onClose}
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
};

interface DataSectionProps {
    title: string;
    children?: React.ReactNode;
}

const DataSection: React.FC<DataSectionProps> = ({ title, children }) => (
    <div className={styles.dataSection}>
        <header>{title}</header>
        <div className={styles.dataGrid}>{children}</div>
    </div>
);

interface DataItemProps {
    label: string;
    children?: React.ReactNode;
}

const DataItem: React.FC<DataItemProps> = ({ label, children }) => (
    <>
        <label>{label}</label>
        <span>{children}</span>
    </>
);

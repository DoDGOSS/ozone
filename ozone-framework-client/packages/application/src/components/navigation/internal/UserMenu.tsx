import styles from "../index.scss";

import React, { useMemo } from "react";

import { Classes, Menu } from "@blueprintjs/core";
import { mainStore } from "../../../stores/MainStore";
import { authStore } from "../../../stores/AuthStore";

import { classNames } from "../../../utility";
import { useBehavior } from "../../../hooks";
import { env } from "../../../environment";

export const UserMenu: React.FC = () => {
    const logoutOpts = useMemo(() => env().logout, []);

    const user = useBehavior(authStore.user);
    const isAdmin = user && user.isAdmin;

    return (
        <Menu data-element-id="user-menu" className={classNames(styles.userMenu, Classes.ELEVATION_1)}>
            <Menu.Item className={styles.menuItem} text="Profile" onClick={mainStore.showUserProfileDialog} />
            {isAdmin ? (
                <Menu.Item
                    className={styles.menuItem}
                    data-element-id="administration"
                    text="Administration"
                    onClick={mainStore.showAdminToolsDialog}
                />
            ) : null}
            <Menu.Item
                data-element-id="about-button"
                className={styles.menuItem}
                text="About"
                onClick={mainStore.showAboutDialog}
            />
            {logoutOpts.isEnabled && (
                <>
                    <Menu.Divider />
                    <Menu.Item
                        data-element-id="logout-button"
                        className={styles.menuItem}
                        icon="log-out"
                        text="Sign Out"
                        onClick={authStore.logout}
                    />
                </>
            )}
        </Menu>
    );
};

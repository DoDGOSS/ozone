import styles from "../index.scss";

import React, { useMemo } from "react";
import { Classes, Menu } from "@blueprintjs/core";

import { AuthUserDTO } from "../../../api/models/AuthUserDTO";
import { env } from "../../../environment";
import { mainStore } from "../../../stores/MainStore";
import { authStore } from "../../../stores/AuthStore";
import { classNames } from "../../../utility";

export interface UserMenuProps {
    user: AuthUserDTO | null;
}

const _UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const { isEnabled: isLogoutEnabled } = useMemo(() => env().logout, []);

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
            {isLogoutEnabled && (
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

export const UserMenu = React.memo(_UserMenu);

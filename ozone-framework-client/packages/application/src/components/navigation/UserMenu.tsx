import * as styles from "./index.scss";

import * as React from "react";

import { Classes, Menu } from "@blueprintjs/core";
import { mainStore } from "../../stores/MainStore";
import { authStore } from "../../stores/AuthStore";

import { classNames } from "../../utility";

export class UserMenu extends React.Component {
    render() {
        return (
            <Menu data-element-id="user-menu" className={classNames(styles.userMenu, Classes.ELEVATION_1)}>
                <Menu.Item className={styles.menuItem} text="Profile" onClick={mainStore.showUserProfileDialog} />
                <Menu.Item className={styles.menuItem} text="Themes" />
                <Menu.Item
                    className={styles.menuItem}
                    data-element-id="administration"
                    text="Administration"
                    onClick={mainStore.showAdminToolsDialog}
                />
                <Menu.Item
                    data-element-id="about-button"
                    className={styles.menuItem}
                    text="About"
                    onClick={mainStore.showAboutDialog}
                />
                <Menu.Divider />
                <Menu.Item
                    data-element-id="logout-button"
                    className={styles.menuItem}
                    icon="log-out"
                    text="Sign Out"
                    onClick={authStore.logout}
                />
            </Menu>
        );
    }
}

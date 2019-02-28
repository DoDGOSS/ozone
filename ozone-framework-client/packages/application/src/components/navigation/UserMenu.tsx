import * as React from "react";

import { Classes, Menu } from "@blueprintjs/core";
import { mainStore } from "../../stores/MainStore";
import { authStore } from "../../stores/AuthStore";

export class UserMenu extends React.Component {
    render() {
        return (
            <Menu data-element-id="user-menu" className={Classes.ELEVATION_1}>
                <Menu.Item text="Profile" onClick={mainStore.showUserProfileDialog} />
                <Menu.Item text="Themes" />
                <Menu.Item
                    data-element-id="administration"
                    text="Administration"
                    onClick={mainStore.showAdminToolsDialog}
                />
                <Menu.Item text="About" data-element-id="about-button" onClick={mainStore.showAboutDialog} />
                <Menu.Divider />
                <Menu.Item data-element-id="logout-button" icon="log-out" text="Sign Out" onClick={authStore.logout} />
            </Menu>
        );
    }
}

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Menu } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";
import { AuthStore } from "../../stores";


@observer
export class UserMenu extends React.Component {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    render() {
        return (
            <Menu data-element-id="user-menu" className={Classes.ELEVATION_1}>
                <Menu.Item text="Profile" onClick={this.mainStore.showUserProfileDialog}/>
                <Menu.Item text="Themes"/>
                <Menu.Item data-element-id="administration" text="Administration"
                           onClick={this.mainStore.showAdminToolsDialog}/>
                <Menu.Item text="About"/>
                <Menu.Divider/>
                <Menu.Item data-element-id="logout-button"
                           icon="log-out"
                           text="Sign Out"
                           onClick={this.authStore.logout}
                           />
            </Menu>
        );
    }

}

import * as React from "react";

import { Classes, Menu } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";
import { UserAPI } from "../../api/src/user";


export class DebugMenu extends React.Component {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(UserAPI)
    private userApi: UserAPI;

    render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <Menu.Item text="Show Warning"
                           icon="warning-sign"
                           onClick={this.mainStore.showWarningDialog}/>
                <Menu.Item text="Get Users"
                           onClick={this.getUsers}/>
            </Menu>
        );
    }

    private getUsers = () => {
        this.userApi.getUsers().then((response) => console.dir(response.data));
    }

}

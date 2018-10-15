import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Menu } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";


@observer
export class UserMenu extends React.Component {

    @inject(MainStore)
    private mainStore: MainStore;

    render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <Menu.Item text="Profile"/>
                <Menu.Item text="Themes"/>
                <Menu.Item text="Administration"
                           onClick={this.mainStore.showAdminToolsDialog}/>
                <Menu.Item text="About"/>
                <Menu.Divider/>
                <Menu.Item icon="log-out" text="Sign Out"/>
            </Menu>
        );
    }

}

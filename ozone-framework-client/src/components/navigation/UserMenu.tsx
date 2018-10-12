import * as React from "react";

import { Classes, Menu } from "@blueprintjs/core";


export class UserMenu extends React.Component {

    render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <Menu.Item text="Profile"/>
                <Menu.Item text="Themes"/>
                <Menu.Item text="Administration"/>
                <Menu.Item text="About"/>
                <Menu.Divider/>
                <Menu.Item icon="log-out" text="Sign Out"/>
            </Menu>
        );
    }

}

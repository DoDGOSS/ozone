import * as React from "react";

import { Classes, Menu } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";


export class DebugMenu extends React.Component {

    @inject(MainStore)
    private mainStore: MainStore;

    public render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <Menu.Item text="Show Warning"
                           icon="warning-sign"
                           onClick={this.mainStore.showWarningDialog}/>
            </Menu>
        )
    }

}

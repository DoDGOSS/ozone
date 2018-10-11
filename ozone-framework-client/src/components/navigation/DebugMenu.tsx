import * as React from "react";

import { Classes, Menu } from "@blueprintjs/core";

import { Inject, MainStore } from "../../stores";


export type DebugMenuProps = {
    store?: MainStore
}

@Inject(({ mainStore }) => ({ store: mainStore }))
export class DebugMenu extends React.Component<DebugMenuProps> {

    public render() {
        const { store } = this.props;

        if (!store) return null;

        return (
            <Menu className={Classes.ELEVATION_1}>
                <Menu.Item text="Show Warning"
                           icon="warning-sign"
                           onClick={store.showWarningDialog}/>
            </Menu>
        )
    }

}

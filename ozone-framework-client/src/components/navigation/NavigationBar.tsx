import "./NavigationBar.css";

import * as React from "react";
import { observer } from "mobx-react";

import { Alignment, Button, Classes, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

import { MainStore } from "../MainStore";
import { NavbarTooltip } from "./NavbarTooltip";
import { actions } from "../../messages";


export type NavigationBarProps = {
    store: MainStore
}

@observer
export class NavigationBar extends React.Component<NavigationBarProps> {

    public render() {
        const store = this.props.store;

        return (
            <Navbar>

                <NavbarGroup align={Alignment.LEFT}>

                    <NavbarTooltip {...actions.dashboards.tooltip}>
                        <Button className={Classes.MINIMAL}
                                {...actions.dashboards.button}
                                active={store.isDashboardDialogVisible}
                                onClick={store.showDashboardDialog}/>
                    </NavbarTooltip>

                    <NavbarTooltip {...actions.widgets.tooltip}>
                        <Button className={Classes.MINIMAL}
                                {...actions.widgets.button}
                                active={store.isWidgetToolbarOpen}
                                onClick={store.toggleWidgetToolbar}/>
                    </NavbarTooltip>

                </NavbarGroup>

                <NavbarGroup align={Alignment.CENTER}>
                    <NavbarHeading>OZONE Widget Framework</NavbarHeading>
                </NavbarGroup>

                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarTooltip {...actions.userProfile.tooltip}>
                        <Button className={Classes.MINIMAL}
                                {...actions.userProfile.button}/>
                    </NavbarTooltip>

                    <NavbarTooltip {...actions.help.tooltip}>
                        <Button className={Classes.MINIMAL}
                                {...actions.help.button}
                                active={store.isHelpDialogVisible}
                                onClick={store.showHelpDialog}/>
                    </NavbarTooltip>

                </NavbarGroup>

            </Navbar>
        )
    }

}

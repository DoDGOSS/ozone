import "./NavigationBar.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Alignment, Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

import { MainStore } from "../MainStore";
import { NavbarTooltip } from "./NavbarTooltip";
import { actions } from "../../messages";


export type NavigationBarProps = {
    store: MainStore,
    className?: string
}

@observer
export class NavigationBar extends React.Component<NavigationBarProps> {

    public render() {
        const { className, store } = this.props;

        return (
            <Navbar className={className}>

                <NavbarGroup align={Alignment.LEFT}>

                    <NavbarTooltip {...actions.dashboards.tooltip}>
                        <Button minimal
                                {...actions.dashboards.button}
                                active={store.isDashboardDialogVisible}
                                onClick={store.showDashboardDialog}/>
                    </NavbarTooltip>

                    <NavbarTooltip {...actions.widgets.tooltip}>
                        <Button minimal
                                {...actions.widgets.button}
                                active={store.isWidgetToolbarOpen}
                                onClick={store.toggleWidgetToolbar}/>
                    </NavbarTooltip>

                    <Button minimal
                            text="Warning"
                            onClick={store.showWarningDialog}/>

                </NavbarGroup>

                <NavbarGroup align={Alignment.CENTER}>
                    <NavbarHeading>OZONE Widget Framework</NavbarHeading>
                </NavbarGroup>

                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarTooltip {...actions.userProfile.tooltip}>
                        <Button minimal
                                {...actions.userProfile.button}/>
                    </NavbarTooltip>

                    <NavbarTooltip {...actions.help.tooltip}>
                        <Button minimal
                                {...actions.help.button}
                                active={store.isHelpDialogVisible}
                                onClick={store.showHelpDialog}/>
                    </NavbarTooltip>

                </NavbarGroup>

            </Navbar>
        )
    }

}

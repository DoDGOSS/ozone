import * as React from "react";

import { Alignment, Button, Classes, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

import { NavbarTooltip } from "./NavbarTooltip";


export class NavigationBar extends React.PureComponent {

    public render() {
        return (
            <Navbar>

                <NavbarGroup align={Alignment.LEFT}>

                    <NavbarTooltip title="Dashboards"
                                   shortcut="Alt+Shift+C"
                                   description="My Dashboards...">
                        <Button className={Classes.MINIMAL}
                                icon="control"
                                text="Dashboards"/>
                    </NavbarTooltip>

                    <NavbarTooltip title="Widgets"
                                   shortcut="Alt+Shift+F"
                                   description="My Widgets...">
                        <Button className={Classes.MINIMAL}
                                icon="widget"
                                text="Widgets"/>
                    </NavbarTooltip>

                </NavbarGroup>

                <NavbarGroup align={Alignment.CENTER}>
                    <NavbarHeading>OZONE Widget Framework</NavbarHeading>
                </NavbarGroup>

                <NavbarGroup align={Alignment.RIGHT}>

                    <NavbarTooltip title="User Profile"
                                   description="User profile options">
                        <Button className={Classes.MINIMAL}
                                icon="user"
                                text="Test Administrator 1"/>
                    </NavbarTooltip>

                    <NavbarTooltip title="Help"
                                   shortcut="Alt+Shift+H"
                                   description="Show help">
                        <Button className={Classes.MINIMAL}
                                icon="help"/>
                    </NavbarTooltip>

                </NavbarGroup>

            </Navbar>
        )
    }

}

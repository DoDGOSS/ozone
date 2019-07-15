import styles from "./index.scss";

import React from "react";
import { Alignment, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

import { PropsBase } from "../../common";
import { useBehavior } from "../../hooks";
import { dashboardStore } from "../../stores/DashboardStore";
import { classNames } from "../../utility";

import {
    AddLayoutButton,
    DesktopButton,
    HelpButton,
    LockButton,
    SaveDashboardButton,
    StacksButton,
    StoreButton,
    ThemeButton,
    UserMenuButton,
    WidgetsButton
} from "./internal";

const _NavigationBar: React.FC<PropsBase> = ({ className }) => {
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    return (
        <Navbar className={classNames(styles.navbar, className)}>
            <NavbarGroup className={styles.group} align={Alignment.LEFT}>
                <StoreButton />
                <DesktopButton />
                <StacksButton />
                <WidgetsButton isLocked={isLocked} />
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.CENTER}>
                <NavbarHeading>OZONE Widget Framework</NavbarHeading>
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.RIGHT}>
                <LockButton dashboard={dashboard} isLocked={isLocked} />
                <SaveDashboardButton />
                <AddLayoutButton isLocked={isLocked} />
                <NavbarDivider />
                <ThemeButton />
                <HelpButton />
                <UserMenuButton />
            </NavbarGroup>
        </Navbar>
    );
};

export const NavigationBar = React.memo(_NavigationBar);

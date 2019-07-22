import styles from "./index.scss";

import React from "react";
import { useBehavior } from "../../hooks";

import { mainStore } from "../../stores/MainStore";

import { Alignment, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

import { PropsBase } from "../../common";

import { classNames } from "../../utility";
import { dashboardStore } from "../../stores/DashboardStore";

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
    const isStoreOpen = useBehavior(mainStore.isStoreOpen);
    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    return (
        <Navbar className={classNames(styles.navbar, className)}>
            <NavbarGroup className={styles.group} align={Alignment.LEFT}>
                <StoreButton />
                <DesktopButton />

                <StacksButton />
                <WidgetsButton isLocked={isLocked} isStoreOpen={isStoreOpen} />
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.CENTER}>
                <NavbarHeading>OZONE Widget Framework</NavbarHeading>
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.RIGHT}>
                <LockButton dashboard={dashboard} isLocked={isLocked} isStoreOpen={isStoreOpen} />
                <SaveDashboardButton isStoreOpen={isStoreOpen} />
                <AddLayoutButton isLocked={isLocked} isStoreOpen={isStoreOpen} />
                <NavbarDivider />
                <ThemeButton />
                <HelpButton />
                <UserMenuButton />
            </NavbarGroup>
        </Navbar>
    );
};

export const NavigationBar = React.memo(_NavigationBar);

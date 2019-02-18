import * as React from "react";
import { useBehavior } from "../../hooks";

import { Alignment, Button, Navbar, NavbarGroup, NavbarHeading, Popover, Position } from "@blueprintjs/core";

import { authStore } from "../../stores/AuthStore";
import { mainStore } from "../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";
import { UserMenu } from "./UserMenu";

import "./NavigationBar.scss";

export type NavigationBarProps = {
    className?: string;
};

export const NavigationBar: React.FunctionComponent<NavigationBarProps> = ({ className }) => {
    const user = useBehavior(authStore.user);

    const isDashboardDialogVisible = useBehavior(mainStore.isDashboardDialogVisible);
    const isHelpDialogVisible = useBehavior(mainStore.isHelpDialogVisible);
    const isWidgetToolbarOpen = useBehavior(mainStore.isWidgetToolbarOpen);

    return (
        <Navbar className={className}>
            <NavbarGroup align={Alignment.LEFT}>
                <CenterButton onClick={() => null} />
                <OWFButton onClick={() => null} />

                <DashboardsButton
                    data-element-id="dashboards-button"
                    active={isDashboardDialogVisible}
                    onClick={mainStore.showDashboardDialog}
                />

                <WidgetsButton active={isWidgetToolbarOpen} onClick={mainStore.toggleWidgetToolbar} />
            </NavbarGroup>

            <NavbarGroup align={Alignment.CENTER}>
                <NavbarHeading>OZONE Widget Framework</NavbarHeading>
            </NavbarGroup>

            <NavbarGroup align={Alignment.RIGHT}>
                <ThemeButton onClick={mainStore.toggleTheme} />
                <HelpButton active={isHelpDialogVisible} onClick={mainStore.showHelpDialog} />
                <UserMenuButton userName={user ? user.userRealName : "Unknown User"} />
            </NavbarGroup>
        </Navbar>
    );
};

type MenuButtonProps = {
    active: boolean;
    onClick: () => void;
};

type NavProps = {
    onClick: () => void;
};

const DashboardsButton: React.FunctionComponent<MenuButtonProps> = ({ active, onClick }) => (
    <NavbarTooltip
        title="Dashboards"
        shortcut="alt+shift+c"
        description="Open the Dashboards window to start or manage your Dashboards."
    >
        <Button
            minimal
            text="Dashboards"
            icon="control"
            active={active}
            onClick={onClick}
            data-element-id="dashboards-button"
        />
    </NavbarTooltip>
);

const CenterButton: React.FunctionComponent<NavProps> = ({ onClick }) => (
    <NavbarTooltip title="AppsMall Center" shortcut="alt+shift+a" description="Open AppsMall">
        <Button minimal icon="shopping-cart" onClick={onClick} data-element-id="center-button" />
    </NavbarTooltip>
);

const ThemeButton: React.FunctionComponent<{ onClick: () => void }> = ({ onClick }) => (
    <NavbarTooltip title="theme switch" shortcut="alt+shift+t" description="toggle theme">
        <Button minimal icon="moon" onClick={onClick} data-element-id="theme-button" />
    </NavbarTooltip>
);

const OWFButton: React.FunctionComponent<NavProps> = ({ onClick }) => (
    <NavbarTooltip title="OWF" shortcut="alt+shift+o" description="Refresh Ozone Widget Framework">
        <Button minimal icon="page-layout" intent="primary" onClick={onClick} data-element-id="owf-button" />
    </NavbarTooltip>
);

const WidgetsButton: React.FunctionComponent<MenuButtonProps> = ({ active, onClick }) => (
    <NavbarTooltip
        title="Widgets"
        shortcut="alt+shift+f"
        description="Open or close the Widgets toolbar to add Widgets to your Dashboard."
    >
        <Button
            minimal
            text="Widgets"
            icon="widget"
            active={active}
            onClick={onClick}
            data-element-id="widgets-button"
        />
    </NavbarTooltip>
);

const HelpButton: React.FunctionComponent<MenuButtonProps> = ({ active, onClick }) => (
    <NavbarTooltip title="Help" shortcut="alt+shift+h" description="Show the Help window.">
        <Button minimal icon="help" active={active} onClick={onClick} />
    </NavbarTooltip>
);

const LoginButton: React.FunctionComponent<MenuButtonProps> = ({ active, onClick }) => (
    <NavbarTooltip title="Login" shortcut="alt+shift+l" description="Temporary placement - Show the Login window.">
        <Button minimal text="Login" icon="log-in" active={active} onClick={onClick} data-element-id="login-button" />
    </NavbarTooltip>
);

type UserMenuButtonProps = {
    userName: string;
};

const UserMenuButton: React.FunctionComponent<UserMenuButtonProps> = ({ userName }) => (
    <NavbarTooltip title="User Profile" description="Open the User Profile options window.">
        <Popover
            content={<UserMenu />}
            minimal
            position={Position.BOTTOM_RIGHT}
            modifiers={{ arrow: { enabled: false } }}
        >
            <Button minimal text={userName} icon="menu" rightIcon="caret-down" data-element-id="user-menu-button" />
        </Popover>
    </NavbarTooltip>
);

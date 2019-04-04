import * as styles from "./index.scss";

import * as React from "react";
import { useBehavior } from "../../hooks";

import {
    Alignment,
    Button,
    Menu,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Position
} from "@blueprintjs/core";

import { authStore } from "../../stores/AuthStore";
import { mainStore } from "../../stores/MainStore";
import { dashboardService } from "../../stores/DashboardService";

import { NavbarTooltip } from "./NavbarTooltip";
import { UserMenu } from "./UserMenu";
import { PropsBase } from "../../common";

import { classNames } from "../../utility";
import { dashboardStore } from "../../stores/DashboardStore";

export const NavigationBar: React.FC<PropsBase> = ({ className }) => {
    const user = useBehavior(authStore.user);

    const isDashboardDialogVisible = useBehavior(mainStore.isDashboardDialogVisible);
    const isHelpDialogVisible = useBehavior(mainStore.isHelpDialogVisible);
    const isWidgetToolbarOpen = useBehavior(mainStore.isWidgetToolbarOpen);

    return (
        <Navbar className={classNames(styles.navbar, className)}>
            <NavbarGroup className={styles.group} align={Alignment.LEFT}>
                <CenterButton onClick={() => null} />
                <OWFButton onClick={() => null} />

                <DashboardsButton
                    data-element-id="dashboards-button"
                    active={isDashboardDialogVisible}
                    onClick={mainStore.showDashboardDialog}
                />

                <WidgetsButton active={isWidgetToolbarOpen} onClick={mainStore.toggleWidgetToolbar} />
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.CENTER}>
                <NavbarHeading>OZONE Widget Framework</NavbarHeading>
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.RIGHT}>
                <Button minimal icon="floppy-disk" onClick={() => dashboardStore.saveCurrentDashboard()} />
                <Popover position={Position.BOTTOM_RIGHT} minimal={true} content={<AddLayoutMenu />}>
                    <Button minimal icon="add" />
                </Popover>
                <NavbarDivider />
                <ThemeButton onClick={mainStore.toggleTheme} />
                <HelpButton active={isHelpDialogVisible} onClick={mainStore.showHelpDialog} />
                <UserMenuButton userName={user ? user.userRealName : "Unknown User"} />
            </NavbarGroup>
        </Navbar>
    );
};

const AddLayoutMenu: React.FC<{}> = () => {
    return (
        <Menu>
            <MenuItem text="Fit Panel" onClick={() => dashboardService.addLayout_TEMP("fit")} />
            <MenuItem text="Tabbed Panel" onClick={() => dashboardService.addLayout_TEMP("tabbed")} />
            <MenuItem text="Accordion Panel" onClick={() => dashboardService.addLayout_TEMP("accordion")} />
            <MenuItem text="Portal Panel" onClick={() => dashboardService.addLayout_TEMP("portal")} />
        </Menu>
    );
};

interface Active {
    active: boolean;
}

interface OnClick {
    onClick: () => void;
}

const DashboardsButton: React.FC<Active & OnClick> = ({ active, onClick }) => (
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

const CenterButton: React.FC<OnClick> = ({ onClick }) => (
    <NavbarTooltip title="AppsMall Center" shortcut="alt+shift+a" description="Open AppsMall">
        <Button minimal icon="shopping-cart" onClick={onClick} data-element-id="center-button" />
    </NavbarTooltip>
);

const ThemeButton: React.FC<OnClick> = ({ onClick }) => (
    <NavbarTooltip title="theme switch" shortcut="alt+shift+t" description="toggle theme">
        <Button minimal icon="moon" onClick={onClick} data-element-id="theme-button" />
    </NavbarTooltip>
);

const OWFButton: React.FC<OnClick> = ({ onClick }) => (
    <NavbarTooltip title="OWF" shortcut="alt+shift+o" description="Refresh Ozone Widget Framework">
        <Button minimal icon="page-layout" intent="primary" onClick={onClick} data-element-id="owf-button" />
    </NavbarTooltip>
);

const WidgetsButton: React.FC<Active & OnClick> = ({ active, onClick }) => (
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

const HelpButton: React.FC<Active & OnClick> = ({ active, onClick }) => (
    <NavbarTooltip title="Help" shortcut="alt+shift+h" description="Show the Help window.">
        <Button minimal icon="help" active={active} onClick={onClick} />
    </NavbarTooltip>
);

const UserMenuButton: React.FC<{ userName: string }> = ({ userName }) => (
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

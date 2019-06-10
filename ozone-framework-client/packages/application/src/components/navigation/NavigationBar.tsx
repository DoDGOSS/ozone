import styles from "./index.scss";

import React from "react";
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

import { mainStore } from "../../stores/MainStore";
import { dashboardService } from "../../services/DashboardService";

import { NavbarTooltip } from "./internal/NavbarTooltip";
import { PropsBase } from "../../common";

import { classNames } from "../../utility";
import { dashboardStore } from "../../stores/DashboardStore";
import { LockButton } from "./internal/LockButton";
import { WidgetsButton } from "./internal/WidgetsButton";
import { StacksButton } from "./internal/StacksButton";
import { UserMenuButton } from "./internal/UserMenuButton";

const _NavigationBar: React.FC<PropsBase> = ({ className }) => {
    const isHelpDialogVisible = useBehavior(mainStore.isHelpDialogVisible);

    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    return (
        <Navbar className={classNames(styles.navbar, className)}>
            <NavbarGroup className={styles.group} align={Alignment.LEFT}>
                <CenterButton onClick={() => null} />
                <OWFButton onClick={() => null} />

                <StacksButton />
                <WidgetsButton />
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.CENTER}>
                <NavbarHeading>OZONE Widget Framework</NavbarHeading>
            </NavbarGroup>

            <NavbarGroup className={styles.group} align={Alignment.RIGHT}>
                <LockButton />
                <Button minimal icon="floppy-disk" onClick={() => dashboardStore.saveCurrentDashboard()} />
                {!isLocked && (
                    <Popover position={Position.BOTTOM_RIGHT} minimal={true} content={<AddLayoutMenu />}>
                        <Button minimal icon="add" data-element-id="add-layout" />
                    </Popover>
                )}
                <NavbarDivider />
                <ThemeButton onClick={mainStore.toggleTheme} />
                <HelpButton active={isHelpDialogVisible} onClick={mainStore.showHelpDialog} />
                <UserMenuButton />
            </NavbarGroup>
        </Navbar>
    );
};

export const NavigationBar = React.memo(_NavigationBar);

const AddLayoutMenu: React.FC<{}> = () => {
    return (
        <Menu>
            <MenuItem text="Fit Panel" onClick={() => dashboardService.addLayout_TEMP("fit")} />
            <MenuItem
                text="Tabbed Panel"
                data-element-id="tabbed-panel"
                onClick={() => dashboardService.addLayout_TEMP("tabbed")}
            />
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

const CenterButton: React.FC<OnClick> = ({ onClick }) => (
    <NavbarTooltip title="AppsMall Center" shortcut="alt+shift+a" description="Open AppsMall">
        <Button minimal icon="shopping-cart" onClick={onClick} data-element-id="center-button" />
    </NavbarTooltip>
);

const ThemeButton: React.FC<OnClick> = ({ onClick }) => (
    <NavbarTooltip title="Theme" shortcut="alt+shift+t" description="Toggle between light and dark themes.">
        <Button minimal icon="moon" onClick={onClick} data-element-id="theme-button" />
    </NavbarTooltip>
);

const OWFButton: React.FC<OnClick> = ({ onClick }) => (
    <NavbarTooltip title="OWF" shortcut="alt+shift+o" description="Refresh Ozone Widget Framework">
        <Button minimal icon="page-layout" intent="primary" onClick={onClick} data-element-id="owf-button" />
    </NavbarTooltip>
);

const HelpButton: React.FC<Active & OnClick> = ({ active, onClick }) => (
    <NavbarTooltip title="Help" shortcut="alt+shift+h" description="Show the Help window.">
        <Button minimal icon="help" active={active} onClick={onClick} />
    </NavbarTooltip>
);

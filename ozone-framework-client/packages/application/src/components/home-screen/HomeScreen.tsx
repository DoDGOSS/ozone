import styles from "./index.scss";

import React, { useEffect } from "react";

import { useBehavior } from "../../hooks";
import { useHotkeysService } from "../../shared/hotkeys";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { AboutDialog } from "../about/About";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";
import { CreateStackDialog } from "../create-stack-screen/CreateStackDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { StackDialog } from "../stack-screen/StackDialog";
import { UserProfileDialog } from "../user-profile/UserProfileDialog";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { WidgetSwitcher } from "../widget-switcher/WidgetSwitcher";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";

export const HomeScreen: React.FC<{}> = () => {
    const isAboutVisible = useBehavior(mainStore.isAboutVisible);

    useHotkeysService();

    useEffect(() => {
        dashboardStore.fetchUserDashboards();
    }, []);

    return (
        <div className={styles.homeScreen} data-test-id="home-screen">
            <NavigationBar className="bp3-dark" />
            <WidgetToolbar className={styles.widgetToolbar} />

            <WidgetDashboard className={styles.widgetDashboard} />

            <CreateStackDialog />
            <AboutDialog isVisible={isAboutVisible} onClose={() => mainStore.hideAboutDialog()} />
            <HelpDialog />
            <StackDialog />
            <AdminToolsDialog />
            <UserProfileDialog />
            <WidgetSwitcher />
        </div>
    );
};

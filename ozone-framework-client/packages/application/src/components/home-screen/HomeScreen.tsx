import * as React from "react";
import { useBehavior } from "../../hooks";

import { mainStore } from "../../stores/MainStore";

import { AboutDialog } from "../about/About";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";
import { CreateDashboardDialog } from "../create-dashboard-screen/CreateDashboardDialog";
import { ReplaceWidgetDialog } from "../widget-dashboard/ReplaceWidgetDialog";
import { DashboardDialog } from "../dashboard-screen/DashboardDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { LoginDialog } from "../login-dialog/LoginDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { WarningDialog } from "../warning-screen/WarningDialog";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";
import { UserAgreement } from "../warning-screen/UserAgreement";
import { UserProfileDialog } from "../user-profile/UserProfileDialog";

import * as styles from "./index.scss";
import { useEffect } from "react";
import { dashboardStore } from "../../stores/DashboardStore";

export const HomeScreen: React.FC<{}> = () => {
    const isAboutVisible = useBehavior(mainStore.isAboutVisible);

    useEffect(() => {
        dashboardStore.fetchUserDashboards();
    }, []);

    return (
        <div className={styles.homeScreen}>
            <NavigationBar className="bp3-dark" />
            <WidgetToolbar className={styles.widgetToolbar} />

            <WidgetDashboard className={styles.widgetDashboard} />

            <CreateDashboardDialog />
            <ReplaceWidgetDialog />
            <UserAgreement />
            <AboutDialog isVisible={isAboutVisible} onClose={() => mainStore.hideAboutDialog()} />
            <WarningDialog />
            <HelpDialog />
            <DashboardDialog />
            <AdminToolsDialog />
            <UserProfileDialog />
            <LoginDialog />
        </div>
    );
};

import * as React from "react";
import { useBehavior } from "../../hooks";

import { mainStore } from "../../stores/MainStore";

import { AboutDialog } from "../about/About";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";
import { ReplaceWidgetDialog } from "../widget-dashboard/ReplaceWidgetDialog";
import { StackDialog } from "../stack-screen/StackDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";
import { UserProfileDialog } from "../user-profile/UserProfileDialog";

import * as styles from "./index.scss";
import { useEffect } from "react";
import { dashboardStore } from "../../stores/DashboardStore";
import { CreateStackDialog } from "../create-stack-screen/CreateStackDialog";

export const HomeScreen: React.FC<{}> = () => {
    const isAboutVisible = useBehavior(mainStore.isAboutVisible);

    useEffect(() => {
        dashboardStore.fetchUserDashboards();
    }, []);

    return (
        <div className={styles.homeScreen} data-test-id="home-screen">
            <NavigationBar className="bp3-dark" />
            <WidgetToolbar className={styles.widgetToolbar} />

            <WidgetDashboard className={styles.widgetDashboard} />

            <CreateStackDialog />
            <ReplaceWidgetDialog />
            <AboutDialog isVisible={isAboutVisible} onClose={() => mainStore.hideAboutDialog()} />
            <HelpDialog />
            <StackDialog />
            <AdminToolsDialog />
            <UserProfileDialog />
        </div>
    );
};

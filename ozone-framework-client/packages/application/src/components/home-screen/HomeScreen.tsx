import styles from "./index.scss";

import React, { useEffect } from "react";

import { useBehavior } from "../../hooks";
import { useHotkeysService } from "../../shared/hotkeys";
import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { classNames } from "../../utility";
import { AboutDialog } from "../about/About";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";
import { CreateStackDialog } from "../create-stack-screen/CreateStackDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { StackDialog } from "../stack-screen/StackDialog";
import { UserProfileDialog } from "../user-profile/UserProfileDialog";

import { StoreComponent } from "../Store/StoreComponent";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { WidgetSwitcher } from "../widget-switcher/WidgetSwitcher";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";
import { StoreComponent } from "../Store/StoreComponent";

export const HomeScreen: React.FC<{}> = () => {
    const isAboutVisible = useBehavior(mainStore.isAboutVisible);
    const isStoreOpen = useBehavior(mainStore.isStoreOpen);
    const storeShouldRefresh = useBehavior(mainStore.storeShouldRefresh);
    const themeClass = useBehavior(mainStore.themeClass);

    useHotkeysService();

    useEffect(() => {
        dashboardStore.fetchUserDashboards();
    }, []);
    return (
        <div className={styles.homeScreen} data-test-id="home-screen">
            <NavigationBar className="bp3-dark" />
            <WidgetToolbar className={styles.widgetToolbar} />

            <div className={styles.full} style={{ display: isStoreOpen ? "none" : "flex" }}>
                <WidgetDashboard className={styles.widgetDashboard} />
            </div>
            {/* So the store page stays rendered and remembers what store you had open when you click away */}
            <div className={classNames(themeClass, styles.full)} style={{ display: isStoreOpen ? "flex" : "none" }}>
                <StoreComponent storeShouldRefresh={storeShouldRefresh} />
            </div>

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

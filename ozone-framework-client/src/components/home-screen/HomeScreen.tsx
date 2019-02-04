import * as styles from "./HomeScreen.scss";

import * as React from "react";

import { lazyInject } from "../../inject";
import { AuthStore, ConfigStore } from "../../stores";

import { DashboardDialog } from "../dashboard-screen/DashboardDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { UserAgreement, WarningDialog } from "../warning-screen/WarningDialog";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";
import { UserProfileDialog } from "../user-profile/UserProfileDialog";
import { LoginDialog } from "../login-dialog/LoginDialog";
import { AboutDialog } from "../about/About";
import { CreateDashboardDialog } from "../create-dashboard-screen/CreateDashboardDialog";

import { ClassificationBanner } from "./ClassificationBanner";

import { DashboardStore } from "../../stores";
import { DEFAULT_DASHBOARD } from "../../stores/DefaultDashboard";

export class HomeScreen extends React.Component {

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    @lazyInject(ConfigStore)
    private configStore: ConfigStore;

    @lazyInject(DashboardStore)
    private dashboardStore: DashboardStore;

    componentWillMount() {
        this.authStore.check();
    }

    render() {
        const classification = this.configStore.classification;
        this.dashboardStore.setDashboard(DEFAULT_DASHBOARD);
        return (
            <div className={styles.homeScreen}>
                {classification.disableTopBanner !== true &&
                <ClassificationBanner className={styles.classificationBanner} {...classification}/>
                }
                <NavigationBar className="bp3-dark"/>
                <WidgetToolbar className={styles.widgetToolbar}/>

                <WidgetDashboard className={styles.widgetDashboard}/>

                {classification.disableBottomBanner !== true &&
                <ClassificationBanner className={styles.classificationBanner} {...classification}/>
                }
                <CreateDashboardDialog />
                <UserAgreement />
                <AboutDialog/>
                <WarningDialog/>
                <HelpDialog/>
                <DashboardDialog/>
                <AdminToolsDialog/>
                <UserProfileDialog/>
                <LoginDialog/>
            </div>
        );
    }

}

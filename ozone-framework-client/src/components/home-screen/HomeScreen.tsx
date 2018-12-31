import * as styles from "./HomeScreen.scss";

import * as React from "react";

import { lazyInject } from "../../inject";
import { AuthStore, ConfigStore } from "../../stores";

import { DashboardDialog } from "../dashboard-screen/DashboardDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { WarningDialog } from "../warning-screen/WarningDialog";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";
import { UserProfileDialog } from "../user-profile/UserProfileDialog";
import { LoginDialog } from "../login-dialog/LoginDialog";

import { ClassificationBanner } from "./ClassificationBanner";


export class HomeScreen extends React.Component {

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    @lazyInject(ConfigStore)
    private configStore: ConfigStore;

    componentWillMount() {
        this.authStore.check();
    }

    render() {
        const classification = this.configStore.classification;

        return (
            <div className={styles.homeScreen}>
                {classification.disableTopBanner !== true &&
                <ClassificationBanner className={styles.classificationBanner} {...classification}/>
                }

                <NavigationBar className={styles.navigationBar}/>
                <WidgetToolbar className={styles.widgetToolbar}/>

                <WidgetDashboard className={styles.widgetDashboard}/>

                {classification.disableBottomBanner !== true &&
                <ClassificationBanner className={styles.classificationBanner} {...classification}/>
                }

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


import * as styles from "../home-screen/HomeScreen.scss";

import * as React from "react";

import { lazyInject } from "../../inject";
import { AuthStore, ConfigStore, MainStore } from "../../stores";

import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { UserAgreement, WarningDialog } from "../warning-screen/WarningDialog";
import { LoginDialog } from "./LoginDialog";
import { AboutDialog } from "../about/About";

import { ClassificationBanner } from "../home-screen/ClassificationBanner";

import { DashboardStore } from "../../stores";
import { LOGIN_DASHBOARD } from "../../stores/DefaultDashboard";

export class LoginScreen extends React.Component {

    @lazyInject(ConfigStore)
    private configStore: ConfigStore;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(DashboardStore)
    private dashboardStore: DashboardStore;

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    componentDidMount() {
        if(this.authStore.isAuthenticated===false){
          this.authStore.check();
        }

        this.dashboardStore.setDashboard(LOGIN_DASHBOARD);
    }

    render() {
        this.mainStore.showWarningDialog();
        // this.mainStore.showLoginDialog();
        const classification = this.configStore.classification;

        return (
            <div className={styles.homeScreen}>
                {classification.disableTopBanner !== true &&
                <ClassificationBanner className={styles.classificationBanner} {...classification}/>
                }
                <LoginDialog/>
                <WarningDialog/>
                <UserAgreement/>
                <AboutDialog/>
                <WidgetDashboard className={styles.widgetDashboard}/>
                {classification.disableBottomBanner !== true &&
                <ClassificationBanner className={styles.classificationBanner} {...classification}/>
                }

            </div>
        );
    }

}

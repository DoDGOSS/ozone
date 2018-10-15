import * as styles from "./HomeScreen.scss";

import * as React from "react";

import { DashboardDialog } from "../dashboard-screen/DashboardDialog";
import { HelpDialog } from "../help-screen/HelpDialog";
import { NavigationBar } from "../navigation/NavigationBar";
import { WarningDialog } from "../warning-screen/WarningDialog";
import { WidgetToolbar } from "../widget-toolbar/WidgetToolbar";
import { WidgetDashboard } from "../widget-dashboard/WidgetDashboard";
import { AdminToolsDialog } from "../admin-tools-dialog/AdminToolsDialog";


export class HomeScreen extends React.Component {

    render() {
        return (
            <div className={styles.homeScreen}>
                <NavigationBar className={styles.navigationBar}/>
                <WidgetToolbar className={styles.widgetToolbar}/>

                <WidgetDashboard className={styles.widgetDashboard}/>

                <WarningDialog/>
                <HelpDialog/>
                <DashboardDialog/>
                <AdminToolsDialog/>
            </div>
        )
    }

}



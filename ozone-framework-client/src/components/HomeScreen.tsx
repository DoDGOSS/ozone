import * as React from "react";
import { observer } from "mobx-react";

import { Button } from "@blueprintjs/core";

import { MainStore } from "./MainStore";
import { DashboardDialog } from "./dashboard-screen/DashboardDialog";
import { HelpDialog } from "./help-screen/HelpDialog";
import { NavigationBar } from "./navigation/NavigationBar";
import { WarningDialog } from "./warning-screen/WarningDialog";
import { WidgetToolbar } from "./widget-toolbar/WidgetToolbar";


export type HomeScreenProps = {
    store: MainStore
}

@observer
export class HomeScreen extends React.Component<HomeScreenProps> {

    public render() {
        const store = this.props.store;

        return (
            <div>
                <NavigationBar store={store}/>
                <WidgetToolbar store={store}/>

                <Button onClick={store.showWarningDialog}>Show Warning</Button>

                <WarningDialog store={store}/>

                <HelpDialog store={store}/>

                <DashboardDialog store={store}/>
            </div>
        )
    }

}


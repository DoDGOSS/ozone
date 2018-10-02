import * as React from "react";

import { Button } from "@blueprintjs/core";

import { NavigationBar } from "./navigation/NavigationBar";
import { WarningDialog } from "./WarningDialog";


export interface HomeScreenState {
    isWarningOpen: boolean
}


export class HomeScreen extends React.PureComponent<any, HomeScreenState> {

    public state: HomeScreenState = {
        isWarningOpen: false
    };

    public render() {
        const { isWarningOpen } = this.state;

        return (
            <div>
                <NavigationBar/>
                <Button onClick={this.showWarningDialog}>Show dialog</Button>
                <WarningDialog isOpen={isWarningOpen}
                               onClose={this.hideWarningDialog}/>
            </div>
        )
    }

    private showWarningDialog = () => this.setState({ isWarningOpen: true });

    private hideWarningDialog = () => this.setState({ isWarningOpen: false });

}



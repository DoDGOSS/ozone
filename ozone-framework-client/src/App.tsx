import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { inject } from "./inject";
import { ConfigStore } from "./stores";

import { HomeScreen } from "./components/home-screen/HomeScreen";


export const enum Paths {
    HOME = "/"
}


export default class App extends React.Component {

    @inject(ConfigStore)
    private configStore: ConfigStore;

    public componentWillMount() {
        this.configStore.fetch();
    }

    public render() {
        return (
            <Router>
                <div>
                    <Route exact path={Paths.HOME}
                           component={HomeScreen}/>
                </div>
            </Router>
        );
    }

}




import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { inject } from "./inject";
import { ConfigStore } from "./stores";

import { HomeScreen } from "./components/home-screen/HomeScreen";
// import { LoginForm } from "./components/login/LoginForm";


export const enum Paths {
    HOME = "/"
}


export default class App extends React.Component {

    @inject(ConfigStore)
    private configStore: ConfigStore;

    componentWillMount() {
        this.configStore.fetch();
    }

    render() {
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




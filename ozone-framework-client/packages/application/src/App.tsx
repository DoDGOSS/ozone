import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { observer } from "mobx-react";

import { HomeScreen } from "./components/home-screen/HomeScreen";
import { LoginScreen } from "./components/login-dialog/LoginScreen";

import { AuthStore } from "./stores";
import { lazyInject } from "./inject";

export const Paths = {
    HOME: "/",
    LOGIN: "/"
};

@observer
export default class App extends React.Component {
    @lazyInject(AuthStore)
    private authStore: AuthStore;

    render() {
        const isLoggedIn = this.authStore.isAuthenticated;
        return (
            <Router>
                <div>
                    {isLoggedIn === false && <Route exact path={Paths.LOGIN} component={LoginScreen} />}
                    {!isLoggedIn === false && <Route exact path={Paths.HOME} component={HomeScreen} />}
                </div>
            </Router>
        );
    }
}

import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { HomeScreen } from "./components/home-screen/HomeScreen";

// import { LoginForm } from "./components/login-dialog/LoginForm";


export const enum Paths {
    HOME = "/"
}


export default class App extends React.Component {

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




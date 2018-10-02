import "./App.css";

import * as React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { HomeScreen } from "./components/HomeScreen";


export const enum Paths {
    HOME = "/"
}


export default class App extends React.Component {

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

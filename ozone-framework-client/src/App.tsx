import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { HomeScreen } from "./components/HomeScreen";
import { mainStore } from "./components/MainStore";


export const enum Paths {
    HOME = "/"
}

export default class App extends React.Component {

    public render() {
        return (
            <Router>
                <div>
                    <Route exact path={Paths.HOME}
                           component={HomeScreenRoute}/>
                </div>
            </Router>
        );
    }

}

const HomeScreenRoute = () => (<HomeScreen store={mainStore}/>);



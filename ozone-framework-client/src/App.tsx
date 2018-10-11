import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { StoreProvider } from "./stores";

import { HomeScreen } from "./components/home-screen/HomeScreen";


export const enum Paths {
    HOME = "/"
}


export default class App extends React.Component {

    public render() {
        return (
            <StoreProvider>
                <Router>
                    <div>
                        <Route exact path={Paths.HOME}
                               component={HomeScreen}/>
                    </div>
                </Router>
            </StoreProvider>
        );
    }

}




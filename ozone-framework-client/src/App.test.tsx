import "reflect-metadata";

import { configure as configureMobX } from "mobx";
import initializeIocContainerBindings from "./inject-bindings";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";


it("renders without crashing", () => {
    initialize();

    const div = document.createElement("div");
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

function initialize() {
    configureMobX({
        enforceActions: "always"
    });

    initializeIocContainerBindings();
}

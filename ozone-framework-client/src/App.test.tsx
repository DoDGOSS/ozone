import "reflect-metadata";

import initializeApplication from "./init";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";


it("renders without crashing", () => {
    initializeApplication();

    const div = document.createElement("div");
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

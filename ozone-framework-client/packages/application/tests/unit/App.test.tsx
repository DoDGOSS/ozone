import "reflect-metadata";

import initializeApplication from "../../src/init";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "../../src/App";

it("renders without crashing", () => {
    initializeApplication();

    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});

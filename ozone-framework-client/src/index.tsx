import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "react-mosaic-component/react-mosaic-component.css";

import "./index.scss";

import "reflect-metadata";

import * as React from "react";
import * as ReactDOM from "react-dom";

import initializeApplication from "./init";
import registerServiceWorker from "./registerServiceWorker";

import App from "./App";

initializeApplication();

ReactDOM.render(
    <App/>,
    document.getElementById("root") as HTMLElement
);

registerServiceWorker();

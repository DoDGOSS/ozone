import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./index.scss";

import "reflect-metadata";

import * as React from "react";
import * as ReactDOM from "react-dom";

import initializeIocContainerBindings from "./inject-bindings";
import registerServiceWorker from "./registerServiceWorker";

import App from "./App";


initializeIocContainerBindings();

ReactDOM.render(
  <App />,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();

import "core-js/stable";
import "regenerator-runtime/runtime";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { ConsentPage } from "./ConsentPage";

import { setDefaultEnvironment } from "../../environment";

setDefaultEnvironment();

ReactDOM.render(<ConsentPage />, document.getElementById("root") as HTMLElement);

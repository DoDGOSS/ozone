import "core-js/stable";
import "regenerator-runtime/runtime";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";

import { LoginPage } from "./LoginPage";

import { setDefaultEnvironment } from "../../environment";

setDefaultEnvironment();

ReactDOM.render(<LoginPage />, document.getElementById("root") as HTMLElement);

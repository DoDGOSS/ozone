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
// tslint:disable-next-line: no-empty
ReactDOM.render(<LoginPage hideLogin={false} onConsentAcknowledged={() => {}} />, document.getElementById(
    "root"
) as HTMLElement);

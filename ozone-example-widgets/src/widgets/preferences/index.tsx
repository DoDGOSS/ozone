import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import "./index.scss";

import { PreferencesWidget } from "./components/PreferencesWidget";

OWF.ready(() => {
    ReactDOM.render(<PreferencesWidget />, document.getElementById("root"));
});

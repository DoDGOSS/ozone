import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "./index.scss";

import { WidgetSearchWidget } from "./components/WidgetSearchWidget";
import { ENABLE_DEBUG_MESSAGE_LOGGING, enableMessageLogging } from "../../common/debug";

OWF.ready(() => {
    ReactDOM.render(<WidgetSearchWidget />, document.getElementById("root"));
});

if (ENABLE_DEBUG_MESSAGE_LOGGING) {
    enableMessageLogging("WidgetSearchWidget");
}

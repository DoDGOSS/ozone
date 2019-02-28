import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import "./index.scss";

import { ColorServerWidget } from "./components/ColorServerWidget";

const ENABLE_DEBUG_MESSAGE_LOGGING = false;

OWF.ready(() => {
    ReactDOM.render(<ColorServerWidget />, document.getElementById("root"));
});

if (ENABLE_DEBUG_MESSAGE_LOGGING) {
    window.addEventListener(
        "message",
        (message: any) => {
            if (typeof message.data === "string") {
                console.log("ColorServer:");
                console.dir(message);
            }
        },
        false
    );
}

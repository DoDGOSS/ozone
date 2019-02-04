import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";


import "./index.scss";

import { ChannelShouterWidget } from "./components/ChannelShouterWidget";


OWF.ready(() => {
    ReactDOM.render(
        <ChannelShouterWidget/>,
        document.getElementById("root"));
});

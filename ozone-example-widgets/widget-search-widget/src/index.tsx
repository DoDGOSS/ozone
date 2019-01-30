import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";


import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";


import "./index.scss";

import { WidgetSearchWidget } from "./components/WidgetSearchWidget";


OWF.ready(() => {
    ReactDOM.render(
        <WidgetSearchWidget/>,
        document.getElementById("root"));
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

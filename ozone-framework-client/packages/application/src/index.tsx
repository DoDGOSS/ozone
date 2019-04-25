import "core-js/stable";
import "regenerator-runtime/runtime";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "react-mosaic-component/react-mosaic-component.css";

import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import registerServiceWorker from "./registerServiceWorker";

import { App } from "./App";

import { eventingService } from "./services/EventingService";
import { WidgetLauncherService } from "./services/WidgetLauncherService";

eventingService.init();
new WidgetLauncherService().init();

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

registerServiceWorker();

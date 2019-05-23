import "core-js/stable";
import "regenerator-runtime/runtime";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

import "../../features/MosaicDashboard/mosaic-dashboard.scss";

import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { eventingService } from "../../services/EventingService";
import { WidgetLauncherService } from "../../services/WidgetLauncherService";

import { MainPage } from "./MainPage";

import { setDefaultEnvironment } from "../../environment";

setDefaultEnvironment();

eventingService.init();
new WidgetLauncherService().init();

ReactDOM.render(<MainPage />, document.getElementById("root") as HTMLElement);

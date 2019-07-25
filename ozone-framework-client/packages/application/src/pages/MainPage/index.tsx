import "core-js/stable";
import "regenerator-runtime/runtime";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import "../../features/MosaicDashboard/mosaic-dashboard.scss";

import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { eventingService } from "../../services/widget-api/EventingService";
import { WidgetLauncherService } from "../../services/widget-api/WidgetLauncherService";
import { IntentsService } from "../../services/widget-api/IntentsService";

import { MainPage } from "./MainPage";

import { setDefaultEnvironment } from "../../environment";

setDefaultEnvironment();

eventingService.init();
new WidgetLauncherService().init();
new IntentsService().init();

ReactDOM.render(<MainPage />, document.getElementById("root") as HTMLElement);

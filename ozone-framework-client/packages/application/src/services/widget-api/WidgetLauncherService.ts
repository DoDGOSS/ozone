import { eventingService, EventingService, parseJson } from "./EventingService";
import { DashboardService, dashboardService } from "../DashboardService";
import { errorStore } from "../ErrorStore";
import { expectArgument, RpcMessage } from "./RpcMessage";

import { isNil, isString } from "../../utility";
import { WidgetLaunchArgs } from "./WidgetLaunchArgs";

export interface WidgetLaunchServiceOpts {
    eventingService?: EventingService;
    dashboardService?: DashboardService;
}

export class WidgetLauncherService {
    private readonly eventingService: EventingService;
    private readonly dashboardService: DashboardService;

    constructor(opts: WidgetLaunchServiceOpts = {}) {
        this.eventingService = opts.eventingService || eventingService;
        this.dashboardService = opts.dashboardService || dashboardService;
    }

    init() {
        this.eventingService.register("_WIDGET_LAUNCHER_CHANNEL").subscribe(this.onLaunchWidget.bind(this));
    }

    private onLaunchWidget(message: RpcMessage): void {
        try {
            const args = parseLaunchArguments(message);
            const isSuccess = this.dashboardService.launchWidget(args);
            this.eventingService.callback(message, isSuccess);
        } catch (error) {
            errorStore.warning("WidgetLauncherService Error", `onLaunchWidget error: ${error.message}`);
        }
    }
}

function parseLaunchArguments(message: RpcMessage): WidgetLaunchArgs {
    const argsJson = expectArgument(message, 1, isString);
    const args = parseJson(argsJson);

    if (isNil(args)) {
        throw new Error("failed to parse launch arguments from JSON");
    }

    if (isNil(args["guid"]) && isNil(args["universalName"])) {
        throw new Error("expected 'guid' or 'universalName' field in launch arguments");
    }

    if (!isNil(args["data"]) && !isString(args["data"])) {
        throw new Error("expected optional 'data' argument to be a string");
    }

    if (!isNil(args["title"]) && !isString(args["title"])) {
        throw new Error("expected optional 'title' argument to be a string");
    }

    // TODO: title, launchOnlyIfClosed (are these optional?)

    return args as WidgetLaunchArgs;
}

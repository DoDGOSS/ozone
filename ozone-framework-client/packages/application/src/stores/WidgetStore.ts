import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { WidgetDTO } from "../api/models/WidgetDTO";
import { WidgetAPI } from "../api/clients/WidgetAPI";

import { ADMIN_WIDGETS } from "./admin-widgets";

import { widgetApi as widgetApiDefault } from "../api/clients/WidgetAPI";

export class WidgetStore {
    private readonly adminWidgets$ = new BehaviorSubject(ADMIN_WIDGETS);

    private readonly error$ = new BehaviorSubject<string | null>(null);

    private readonly loadingWidgets$ = new BehaviorSubject(true);

    private readonly standardWidgets$ = new BehaviorSubject<WidgetDTO[]>([]);

    private readonly widgetApi: WidgetAPI;

    constructor(widgetApi?: WidgetAPI) {
        this.widgetApi = widgetApi || widgetApiDefault;
    }

    adminWidgets = () => asBehavior(this.adminWidgets$);
    isLoading = () => asBehavior(this.loadingWidgets$);
    standardWidgets = () => asBehavior(this.standardWidgets$);

    fetchWidgets = () => {
        this.widgetApi
            .getWidgets()
            .then((results) => {
                this.onWidgetSuccess(results.data.data);
            })
            .catch((error) => {
                this.onWidgetFailure(error);
            });
    };

    private onWidgetSuccess = (widgets: WidgetDTO[]) => {
        const result = widgets
            .filter((widget) => !widget.value.universalName.includes("admin"))
            .sort((a, b) => a.value.namespace.localeCompare(b.value.namespace));

        this.standardWidgets$.next(result);
        this.loadingWidgets$.next(false);
        this.error$.next(null);
    };

    private onWidgetFailure = (ex: Error) => {
        this.adminWidgets$.next([]);
        this.standardWidgets$.next([]);
        this.error$.next(ex.message);
    };
}

export const widgetStore = new WidgetStore();

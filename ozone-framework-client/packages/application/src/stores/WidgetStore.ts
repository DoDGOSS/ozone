import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { WidgetDTO } from "../api/models/WidgetDTO";
import { WidgetAPI, widgetApi as widgetApiDefault } from "../api/clients/WidgetAPI";

import { not, some } from "../utility";

import { ADMIN_WIDGETS } from "./admin-widgets";

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
            .catch(this.onWidgetFailure);
    };

    private onWidgetSuccess = (widgets: WidgetDTO[]) => {
        const result = widgets.filter(not(isAdminWidget)).sort(byNamespace);

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

function isAdminWidget(widget: WidgetDTO): boolean {
    return some(widget.value.widgetTypes, (widgetType) => widgetType.name === "administration");
}

function byNamespace(a: WidgetDTO, b: WidgetDTO): number {
    return a.value.namespace.localeCompare(b.value.namespace);
}

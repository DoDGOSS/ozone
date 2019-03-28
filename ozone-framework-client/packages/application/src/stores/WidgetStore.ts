import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { WidgetDTO } from "../api/models/WidgetDTO";
import { WidgetAPI, widgetApi as widgetApiDefault } from "../api/clients/WidgetAPI";

import { not, some } from "../utility";

import { Widget } from "../models/Widget";
import { ADMIN_WIDGETS } from "../test-data/admin-widgets";
import { widgetFromJson } from "../codecs/Widget.codec";
import { EXAMPLE_WIDGETS } from "../test-data/example-widgets";

// TODO: Fetch the real widgets after the backend has been updated

export class WidgetStore {
    private readonly widgetApi: WidgetAPI;

    private readonly adminWidgets$ = new BehaviorSubject<Widget[]>(ADMIN_WIDGETS);
    private readonly standardWidgets$ = new BehaviorSubject<Widget[]>(EXAMPLE_WIDGETS);
    private readonly isLoading$ = new BehaviorSubject(true);
    private readonly error$ = new BehaviorSubject<string | null>(null);

    constructor(widgetApi?: WidgetAPI) {
        this.widgetApi = widgetApi || widgetApiDefault;
    }

    adminWidgets = () => asBehavior(this.adminWidgets$);
    standardWidgets = () => asBehavior(this.standardWidgets$);
    isLoading = () => asBehavior(this.isLoading$);

    fetchWidgets = () => {
        this.isLoading$.next(false);

        // this.widgetApi
        //     .getWidgets()
        //     .then((results) => {
        //         this.onWidgetSuccess(results.data.data);
        //     })
        //     .catch(this.onWidgetFailure);
    };

    private onWidgetSuccess = (widgets: WidgetDTO[]) => {
        const result = widgets
            .filter(not(isAdminWidget))
            .sort(byNamespace)
            .map(widgetFromJson);

        this.standardWidgets$.next(result);
        this.isLoading$.next(false);
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

import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../../../observables";

import { Widget } from "../../../stores/interfaces";
import { LayoutType, Panel, PanelState } from "./types";

import { find } from "lodash";

export abstract class AbstractPanel<T extends PanelState> implements Panel<T> {
    protected readonly state$: BehaviorSubject<T>;

    protected constructor(state: T) {
        this.state$ = new BehaviorSubject(state);
    }

    get id(): string {
        return this.state$.value.id;
    }

    get type(): LayoutType {
        return this.state$.value.type;
    }

    get title(): string {
        return this.state$.value.title;
    }

    state = () => asBehavior(this.state$);

    abstract closeWidget(widgetId: string): void;

    findWidgetById = (widgetId: string): Widget | undefined => {
        const { widgets } = this.state$.value;
        return find(widgets, (w) => w.id === widgetId);
    };
}

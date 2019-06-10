import { find } from "lodash";

import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../../observables";

import { AddWidgetsOpts, LayoutType, Panel, PanelState } from "./types";
import { WidgetInstance } from "../WidgetInstance";

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

    get widgetCount(): number {
        return this.state$.value.widgets.length;
    }

    state = () => asBehavior(this.state$);

    abstract addWidgets(instance: WidgetInstance | WidgetInstance[], opts?: AddWidgetsOpts): void;

    abstract closeWidget(instanceId: string): WidgetInstance | undefined;

    findWidget(instanceId: string): WidgetInstance | undefined {
        const { widgets } = this.state$.value;
        return find(widgets, (w) => w.id === instanceId);
    }

    setTitle(value: string): void {
        const prev = this.state$.value;

        this.state$.next({
            ...prev,
            title: value
        });
    }
}

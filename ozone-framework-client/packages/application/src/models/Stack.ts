import { Widget } from "./Widget";
import { Dashboard } from "./Dashboard";

export class StackProps {
    approved: boolean;
    stackContext: string;
    dashboards: Dictionary<Dashboard>;
    description?: string;
    descriptorUrl?: string;
    id: number;
    imageUrl?: string;
    name: string;
    owner?: {
        username: string;
    };

    constructor(props: PropertiesOf<StackProps>) {
        Object.assign(this, props);
    }
}

export class Stack extends StackProps {
    getDashboards(onlyUnique?: boolean): Dashboard[] {
        const stackDashboards = [];
        for (const dashGuid in this.dashboards) {
            if (
                !this.dashboards.hasOwnProperty(dashGuid) ||
                stackDashboards.find((sd: Dashboard) => sd.guid === dashGuid) !== undefined
            ) {
                continue;
            } else {
                stackDashboards.push(this.dashboards[dashGuid]);
            }
        }
        return stackDashboards;
    }

    getWidgets(onlyUnique?: boolean): Widget[] {
        const stackWidgets = [];
        for (const dash of this.getDashboards()) {
            const dashValue = dash.state().value;
            for (const pID in dashValue.panels) {
                if (!dashValue.panels.hasOwnProperty(pID)) {
                    continue;
                }
                const panel = dashValue.panels[pID].state().value;
                for (const w of panel.widgets) {
                    if (!w.userWidget) {
                        // undefined if it used to hold a widget that's since been deleted.
                        continue;
                    }
                    if (
                        onlyUnique &&
                        stackWidgets.find((sw: Widget) => sw.universalName === w.userWidget.widget.universalName) !==
                            undefined
                    ) {
                        continue;
                    }
                    const widget = w.userWidget.widget;
                    stackWidgets.push(widget);
                }
            }
            // background widgets
            for (const w of dashValue.backgroundWidgets) {
                if (!w.userWidget) {
                    // undefined if it used to hold a widget that's since been deleted.
                    continue;
                }
                if (
                    onlyUnique &&
                    stackWidgets.find((sw: Widget) => sw.universalName === w.userWidget.widget.universalName) !==
                        undefined
                ) {
                    continue;
                }
                const widget = w.userWidget.widget;
                stackWidgets.push(widget);
            }
        }
        return stackWidgets;
    }
}

import * as styles from "./WidgetTile.scss";

import * as React from "react";
import { observer } from "mobx-react";
import { action, observable } from "mobx";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { DashboardStore, MainStore, WidgetStore } from "../../stores";

export interface Widget {
    id: string;
    definition: WidgetDefinition;
}

export interface WidgetDefinition {
    id: string;
    title: string;
    element: JSX.Element;
}

@observer
export class AdminToolsDialog extends React.Component {
    @lazyInject(DashboardStore)
    private dashboardStore: DashboardStore;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(WidgetStore)
    private widgetStore: WidgetStore;

    @observable
    private dashboard = this.dashboardStore.getDashboard();

    @observable
    private windowCount: number = Object.keys(this.dashboard.widgets).length;

    @action.bound
    addWidget(widget: Widget) {
        const addWidget: Widget = {
            id: widget.id,
            definition: widget.definition
        };
        this.dashboard.widgets[String(++this.windowCount)] = addWidget;
        this.dashboardStore.addToTopRight(this.dashboard, widget.id, this.windowCount);
    }

    render() {
        const adminWidgets = this.widgetStore.adminWidgets;

        return (
            <div>
                <Dialog
                    className={[this.mainStore.darkClass, styles.adminToolsDialog].join(" ")}
                    isOpen={this.mainStore.isAdminToolsDialogOpen}
                    onClose={this.mainStore.hideAdminToolsDialog}
                    title="Administration"
                    icon="wrench"
                >
                    <div data-element-id="administration" className={Classes.DIALOG_BODY}>
                        <div className={styles.tileContainer}>
                            {adminWidgets.map((widget) => (
                                <WidgetTile
                                    key={widget.id}
                                    title={widget.title}
                                    iconUrl={widget.iconUrl}
                                    onClick={() => {
                                        this.addWidget(widget);
                                        this.mainStore.hideAdminToolsDialog();
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export type WidgetTileProps = {
    title: string;
    iconUrl: string;
    onClick: () => void;
};

export class WidgetTile extends React.PureComponent<WidgetTileProps> {
    render() {
        const { title, iconUrl, onClick } = this.props;

        return (
            <div className={styles.widgetTile} data-element-id={title}>
                <button onClick={onClick}>
                    <img className={styles.tileIcon} src={iconUrl} />
                    <span className={styles.tileTitle}>{title}</span>
                </button>
            </div>
        );
    }
}

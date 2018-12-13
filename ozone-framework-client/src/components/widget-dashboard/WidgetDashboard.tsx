import * as styles from "./WidgetDashboard.scss";

import React from "react";
import { observer } from 'mobx-react';

import { Mosaic, MosaicBranch, MosaicWindow } from "react-mosaic-component";

import { classNames } from "../util";

import { lazyInject } from "../../inject";
import { DashboardNode, DashboardStore } from "../../stores";


const DashboardLayout = Mosaic.ofType<string>();
const DashboardWindow = MosaicWindow.ofType<string>();

export type WidgetDashboardProps = {
    className?: string;
};

@observer
export class WidgetDashboard extends React.Component<WidgetDashboardProps, {}> {

    @lazyInject(DashboardStore)
    private dashboardStore: DashboardStore;

    render() {
        const { className } = this.props;
        const layout = this.dashboardStore.layout;
        const widgets = this.dashboardStore.widgets;

        return (
            <div className={classNames(styles.widgetDashboard, className)}>
                <DashboardLayout
                    value={layout}
                    onChange={this.onChange}
                    renderTile={(id: string, path: MosaicBranch[]) => {
                        const widget = widgets && widgets[id];
                        if (!widget) {
                            return (
                                <DashboardWindow title="Error"
                                                 path={path}>
                                    <h1>Error: Widget not found</h1>
                                </DashboardWindow>
                            );
                        }

                        const widgetDef = widget.definition;
                        return (
                            <DashboardWindow title={widgetDef.title}
                                             path={path}>
                                {widgetDef.element}
                            </DashboardWindow>);
                    }}
                />
            </div>
        );
    }

    private onChange = (currentNode: DashboardNode | null) => {
        this.dashboardStore.setLayout(currentNode);
    }

}

import * as styles from "./WidgetDashboard.scss";

import * as React from "react";

import * as GridLayout from "react-grid-layout";

import { classNames } from "../util";

import { UsersWidget } from "../admin/widgets/Users/UsersWidget";
import { GroupsWidget } from "../admin/widgets/Groups/GroupsWidget";


const layout = [
    { i: 'a', x: 0, y: 0, w: 4, h: 4 },
    { i: 'b', x: 2, y: 0, w: 6, h: 4 },
    { i: 'c', x: 0, y: 0, w: 8, h: 4 }
];

export type WidgetDashboardProps = {
    className?: string;
};

export class WidgetDashboard extends React.Component<WidgetDashboardProps> {

    render() {
        const { className } = this.props;

        return (
            <div className={classNames(styles.widgetDashboard, className)}>
                <GridLayout className="layout"
                            layout={layout}
                            cols={8}
                            rowHeight={100}
                            width={1200}
                            autoSize={true}
                            draggableHandle=".dragHandle"
                            compactType={null}>
                    <div key="b">
                        <GroupsWidget/>
                    </div>
                    <div key="c">
                        <UsersWidget/>
                    </div>
                </GridLayout>
            </div>
        );
    }

}

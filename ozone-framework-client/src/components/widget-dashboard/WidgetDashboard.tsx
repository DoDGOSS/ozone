import * as styles from "./WidgetDashboard.scss";

import * as React from "react";

import * as GridLayout from "react-grid-layout";
import { WidgetContainer } from "./WidgetContainer";


const layout = [
    { i: 'a', x: 0, y: 0, w: 3, h: 2 },
    { i: 'b', x: 4, y: 0, w: 1, h: 2 }
];

export class WidgetDashboard extends React.Component {

    public render() {
        return (
            <div className={styles.widgetDashboard}>
                <GridLayout className="layout"
                            layout={layout}
                            cols={8}
                            rowHeight={100}
                            width={1200}
                            autoSize={true}
                            draggableHandle=".dragHandle"
                            compactType={null}>
                    <div key="a">
                        <WidgetContainer/>
                    </div>
                    <div key="b">
                        <WidgetContainer/>
                    </div>
                </GridLayout>
            </div>
        )
    }

}



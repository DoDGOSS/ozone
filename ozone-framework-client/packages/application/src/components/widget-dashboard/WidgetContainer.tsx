import * as styles from "./WidgetContainer.scss";

import * as React from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";

import { classNames } from "../util";

export type WidgetContainerProps = {
    title?: string;
    body?: any;
    "data-instance"?: string;
};

export class WidgetContainer extends React.Component<WidgetContainerProps, {}> {
    render() {
        return (
            <div className={styles.widgetContainer} data-role="widget" data-instance={this.props["data-instance"]}>
                <div className={classNames(styles.widgetContainerToolbar, "dragHandle")} data-role="toolbar">
                    <div className={styles.widgetContainerToolbarTitle} data-role="title">
                        {this.props.title}
                    </div>
                    <ButtonGroup>
                        <Button className={Classes.MINIMAL} icon="cross" />
                    </ButtonGroup>
                </div>
                <div className={styles.widgetContainerContent}>{this.props.body}</div>
            </div>
        );
    }
}

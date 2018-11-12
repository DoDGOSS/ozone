import * as styles from "./WidgetContainer.scss";

import * as React from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";

import { classNames } from "../util";


export type WidgetContainerProps = {
    title?: string;
    body?: any;
};


export class WidgetContainer extends React.Component<WidgetContainerProps, {}> {

    render() {
        return (
            <div className={styles.widgetContainer}>
                <div className={classNames(styles.widgetContainerToolbar, "dragHandle")}>
                    <div className={styles.widgetContainerToolbarTitle}>
                        {this.props.title}
                    </div>
                    <ButtonGroup>
                        <Button className={Classes.MINIMAL}
                                icon="cross"/>
                    </ButtonGroup>
                </div>
                <div className={styles.widgetContainerContent}>
                    {this.props.body}
                </div>
            </div>
        );
    }

}

import * as styles from "./WidgetContainer.scss";

import * as React from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";

import { classNames } from "../util";


export type WidgetContainerProps = {}

export class WidgetContainer extends React.Component<WidgetContainerProps> {

    public render() {
        return (
            <div className={styles.widgetContainer}>
                <div className={classNames(styles.widgetContainerToolbar, "dragHandle")}>
                    <div className={styles.widgetContainerToolbarTitle}>
                        My Widget
                    </div>
                    <ButtonGroup>
                        <Button className={Classes.MINIMAL}
                                icon="cross"/>
                    </ButtonGroup>
                </div>
                <div className={styles.widgetContainerContent}/>
            </div>
        )
    }

}

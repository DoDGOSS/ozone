import * as React from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";


export type WidgetContainerProps = {}

export class WidgetContainer extends React.Component<WidgetContainerProps> {

    public render() {
        return (
            <div className="widget-container">
                <div className="widget-container--toolbar">
                    <div className="widget-container--toolbar--title">
                        My Widget
                    </div>
                    <ButtonGroup>
                        <Button className={Classes.MINIMAL}
                                icon="cross"/>
                    </ButtonGroup>
                </div>
                <div className="widget-container--content"/>
            </div>
        )
    }

}

import "./WidgetToolbar.css";

import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Collapse, InputGroup } from "@blueprintjs/core";

import { MainStore } from "../MainStore";
import { handleStringChange } from "../util";


export type WidgetToolbarProps = {
    store: MainStore;
}

@observer
export class WidgetToolbar extends React.Component<WidgetToolbarProps> {

    public render() {
        const { store } = this.props;

        return (
            <Collapse isOpen={store.isWidgetToolbarOpen}>
                <div className="widget-toolbar">
                    <div className="widget-toolbar-menu">
                        <InputGroup
                            placeholder="Search..."
                            leftIcon="search"
                            round={true}
                            onChange={handleStringChange(store.setWidgetFilter)}/>
                        <Button className={Classes.MINIMAL}
                                icon="pin"/>
                        <Button className={Classes.MINIMAL}
                                icon="cross"
                                onClick={store.closeWidgetToolbar}/>
                    </div>
                </div>
            </Collapse>
        )
    }

}

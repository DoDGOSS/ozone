import * as styles from "./WidgetToolbar.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Button, Collapse, InputGroup } from "@blueprintjs/core";

import { inject } from "../../inject";
import { MainStore } from "../../stores";

import { classNames, handleStringChange } from "../util";


export type WidgetToolbarProps = {
    className?: string;
}

@observer
export class WidgetToolbar extends React.Component<WidgetToolbarProps> {

    @inject(MainStore)
    private mainStore: MainStore;

    render() {
        const { className } = this.props;

        return (
            <Collapse isOpen={this.mainStore.isWidgetToolbarOpen}>
                <div className={classNames(styles.widgetToolbar, className)}>
                    <div className={styles.widgetToolbarMenu}>
                        <InputGroup
                            placeholder="Search..."
                            leftIcon="search"
                            round={true}
                            onChange={handleStringChange(this.mainStore.setWidgetFilter)}/>
                        <Button minimal icon="pin"/>
                        <Button minimal icon="cross"
                                onClick={this.mainStore.closeWidgetToolbar}/>
                    </div>
                </div>
            </Collapse>
        )
    }

}

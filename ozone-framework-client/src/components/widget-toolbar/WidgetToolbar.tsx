import * as styles from "./WidgetToolbar.scss";

import * as React from "react";
import { observer } from "mobx-react";

// Collapse
import { Button, InputGroup, Overlay } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";

import { classNames, handleStringChange } from "../util";


export type WidgetToolbarProps = {
    className?: string;
};

@observer
export class WidgetToolbar extends React.Component<WidgetToolbarProps> {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    render() {
        const { className } = this.props;

        return (
            <Overlay
                isOpen={this.mainStore.isWidgetToolbarOpen}
                hasBackdrop={false}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                onClose={this.mainStore.closeWidgetToolbar}
            >
                <div
                    className={classNames(styles.widgetToolbar, className, this.mainStore.darkClass)}
                    data-element-id='widgets-dialog'
                >
                    <h3 className={styles.widgetToolbarTitle}>Widgets</h3>
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
                    <hr/>
                </div>
            </Overlay>
        );
    }

}

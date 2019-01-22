import * as styles from "./WidgetToolbar.scss";

import * as React from "react";
import { observer } from "mobx-react";

// Collapse
import { Button, Classes, InputGroup, Overlay } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore, WidgetStore } from "../../stores";

import { classNames, handleStringChange } from "../util";

// TODO - Filter on search (mainstore Widget filter)


export type WidgetToolbarProps = {
    className?: string;
};

@observer
export class WidgetToolbar extends React.Component<WidgetToolbarProps> {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(WidgetStore)
    private widgetStore: WidgetStore;

    render() {
        const { className } = this.props;

        const userWidgets = this.widgetStore.userWidgets;

        return (
            <Overlay
                isOpen={this.mainStore.isWidgetToolbarOpen}
                hasBackdrop={false}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                onClose={this.mainStore.closeWidgetToolbar}
                className={Classes.OVERLAY_SCROLL_CONTAINER}
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

                    <div className={Classes.DIALOG_BODY}>
                        <ul className={styles.widgetList}>
                            {userWidgets.map(widget =>
                                <Widget key={widget.id}
                                        title={widget.title}
                                        iconUrl={widget.iconUrl}
                                />

                            )}
                        </ul>
                    </div>

                </div>
                <div className={styles.widgetToolbarFooter}>
                    <div className={styles.buttonBar}>
                        <Button
                            text="Prev"
                            icon="undo"
                            small={true}
                        />
                        <p>
                            <b>Page 1</b>
                        </p>
                        <Button
                            text="Next"
                            icon="fast-forward"
                            small={true}
                        />
                    </div>
                </div>
            </Overlay>
        );
    }

}

export type WidgetProps = {
    title: string;
    iconUrl: string;
    url?: string;
};

export class Widget extends React.PureComponent<WidgetProps> {

    render() {
        const { title, iconUrl, url } = this.props;

        return (
            <li>
                <a href={url}>
                    <img className={styles.tileIcon} src={iconUrl}/>
                    <span className={styles.tileTitle}>{title}</span>
                </a>
            </li>
        );
    }

}

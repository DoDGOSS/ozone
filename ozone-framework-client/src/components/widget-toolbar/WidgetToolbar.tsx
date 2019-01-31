import * as styles from "./WidgetToolbar.scss";

import * as React from "react";
import { observer } from "mobx-react";

// Collapse
import { Button, Classes, InputGroup, Overlay } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore, WidgetStore } from "../../stores";
import { IMAGE_ROOT_URL } from "../../stores/WidgetStore";

// handleStringChange
import { classNames,  } from "../util";


export type WidgetToolbarProps = {
    className?: string;
};

interface State {
    filter: string;
    toggleAlphabeticalAsc: boolean;
    toggleAlphabeticalDsc: boolean;
}

@observer
export class WidgetToolbar extends React.Component<WidgetToolbarProps, State> {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(WidgetStore)
    private widgetStore: WidgetStore;


    constructor(props: any) {
        super(props);
        this.state = {
            filter: '',
            toggleAlphabeticalAsc: true,
            toggleAlphabeticalDsc: false
        };
    }

    componentDidMount() {
        this.widgetStore.getWidgets();
    }

    render() {
        const { className } = this.props;

        if (this.widgetStore.loadingWidgets) {
            return <span>Loading...</span>;
        }

        let widgets = this.widgetStore.standardWidgets;

        if (this.state.toggleAlphabeticalDsc) {
            widgets = widgets.sort((a, b) => b.value.namespace.localeCompare(a.value.namespace));
        }

        const filter = this.state.filter.toLowerCase();

        if (filter) {
            widgets = widgets.filter(row => {
                return row.value.namespace.toLowerCase().includes(filter);
            });
        }


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
                            // TODO - Implement mainstore widget filter
                            // onChange={handleStringChange(this.mainStore.setWidgetFilter)}
                            value={this.state.filter}
                            onChange={(e: any) => this.setState({filter: e.target.value})}
                            data-element-id="widget-search-field"
                        />
                        <Button minimal icon="sort-alphabetical"
                                onClick={this.toggleAlphabeticalAsc}
                                active={this.state.toggleAlphabeticalAsc}
                                data-element-id="widget-sort-ascending" />
                        <Button minimal icon="sort-alphabetical-desc"
                                onClick={this.toggleAlphabeticalDsc}
                                active={this.state.toggleAlphabeticalDsc}
                                data-element-id="widget-sort-descending" />
                        <Button minimal icon="pin"/>
                        <Button minimal icon="cross"
                                onClick={this.mainStore.closeWidgetToolbar}/>
                    </div>
                    <hr/>

                    <div className={Classes.DIALOG_BODY}>
                        <ul className={styles.widgetList}>
                            {widgets.map(widget =>
                                <Widget key={widget.id}
                                        name={widget.value.namespace}
                                        // TODO - Replace this temp fix to display images
                                        // smallIconUrl={widget.value.smallIconUrl}
                                        smallIconUrl={IMAGE_ROOT_URL + widget.value.smallIconUrl.replace("static/themes/common/images", "")}
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

    private toggleAlphabeticalDsc = () => {
        this.setState({
            toggleAlphabeticalAsc: false,
            toggleAlphabeticalDsc: true
        });
    };

    private toggleAlphabeticalAsc = () => {
        this.setState({
            toggleAlphabeticalAsc: true,
            toggleAlphabeticalDsc: false
        });
    };

}

export type WidgetProps = {
    name: string;
    smallIconUrl: string;
    description?: string;
    url?: string;
};

export class Widget extends React.PureComponent<WidgetProps> {

    render() {
        const { name, smallIconUrl, url } = this.props;

        return (
            <li>
                <a href={url}>
                    <img className={styles.tileIcon} src={smallIconUrl}/>
                    <span className={styles.tileTitle}>{name}</span>
                </a>
            </li>
        );
    }

}

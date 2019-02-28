import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, InputGroup, Overlay } from "@blueprintjs/core";

import { widgetStore } from "../../stores/WidgetStore";
import { mainStore } from "../../stores/MainStore";
import { PropsBase } from "../../common";

import { classNames, handleStringChange, isBlank } from "../../utility";

import { IMAGE_ROOT_URL } from "../../stores/default-layouts";

import * as styles from "./index.scss";

type SortOrder = "asc" | "dsc";

export const WidgetToolbar: React.FunctionComponent<PropsBase> = ({ className }) => {
    const isOpen = useBehavior(mainStore.isWidgetToolbarOpen);
    const themeClass = useBehavior(mainStore.themeClass);

    const isLoading = useBehavior(widgetStore.isLoading);
    let widgets = useBehavior(widgetStore.standardWidgets);

    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    useEffect(() => widgetStore.fetchWidgets(), []);

    if (sortOrder === "asc") {
        widgets.sort((a, b) => a.value.namespace.localeCompare(b.value.namespace))
    } else {
        widgets.sort((a, b) => b.value.namespace.localeCompare(a.value.namespace));
    }

    if (!isBlank(filter)) {
        widgets = widgets.filter((row) => {
            return row.value.namespace.toLowerCase().includes(filter.toLocaleLowerCase());
        });
    }

    if (isLoading) {
        return <span>Loading...</span>;
    }

    return (
        <Overlay
            isOpen={isOpen}
            hasBackdrop={false}
            canOutsideClickClose={true}
            canEscapeKeyClose={true}
            onClose={mainStore.closeWidgetToolbar}
            className={Classes.OVERLAY_SCROLL_CONTAINER}
        >
            <div className={classNames(styles.toolbar, className, themeClass)} data-element-id="widgets-dialog">
                <h3 className={styles.toolbarTitle}>Widgets</h3>
                <div className={styles.toolbarMenu}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        round={true}
                        // TODO - Implement mainstore widget filter
                        // onChange={handleStringChange(this.mainStore.setWidgetFilter)}
                        value={filter}
                        onChange={handleStringChange(setFilter)}
                        data-element-id="widget-search-field"
                    />
                    <Button
                        minimal
                        icon="sort-alphabetical"
                        onClick={() => setSortOrder("asc")}
                        active={sortOrder === "asc"}
                        data-element-id="widget-sort-ascending"
                    />
                    <Button
                        minimal
                        icon="sort-alphabetical-desc"
                        onClick={() => setSortOrder("dsc")}
                        active={sortOrder === "dsc"}
                        data-element-id="widget-sort-descending"
                    />
                    <Button minimal icon="pin"/>
                    <Button minimal icon="cross" onClick={mainStore.closeWidgetToolbar}/>
                </div>
                <hr/>

                <div className={Classes.DIALOG_BODY}>
                    <ul className={styles.widgetList}>
                        {widgets.map((widget) => (
                            <Widget
                                key={widget.id}
                                name={widget.value.namespace}
                                // TODO - Replace this temp fix to display images
                                // smallIconUrl={widget.value.smallIconUrl}
                                smallIconUrl={
                                    IMAGE_ROOT_URL +
                                    widget.value.smallIconUrl.replace("static/themes/common/images", "")
                                }
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.toolbarFooter}>
                <div className={styles.buttonBar}>
                    <Button text="Prev" icon="undo" small={true}/>
                    <p>
                        <b>Page 1</b>
                    </p>
                    <Button text="Next" icon="fast-forward" small={true}/>
                </div>
            </div>
        </Overlay>
    );
};

export type WidgetProps = {
    name: string;
    smallIconUrl: string;
    description?: string;
    url?: string;
};

export const Widget: React.FunctionComponent<WidgetProps> = (props) => {
    const { name, smallIconUrl, url } = props;

    return (
        <li>
            <a href={url}>
                <img className={styles.tileIcon} src={smallIconUrl}/>
                <span className={styles.tileTitle}>{name}</span>
            </a>
        </li>
    );
};

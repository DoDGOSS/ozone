import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, InputGroup, Overlay } from "@blueprintjs/core";

import { widgetStore } from "../../stores/WidgetStore";
import { mainStore } from "../../stores/MainStore";
import { PropsBase } from "../../common";
import { SortButton, SortOrder } from "./SortButton";

import { classNames, handleStringChange, isBlank } from "../../utility";

import { IMAGE_ROOT_URL } from "../../stores/default-layouts";

import * as styles from "./index.scss";

export const WidgetToolbar: React.FC<PropsBase> = ({ className }) => {
    const isOpen = useBehavior(mainStore.isWidgetToolbarOpen);
    const themeClass = useBehavior(mainStore.themeClass);

    const isLoading = useBehavior(widgetStore.isLoading);
    let widgets = useBehavior(widgetStore.standardWidgets);

    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    useEffect(() => widgetStore.fetchWidgets(), []);

    if (sortOrder === "asc") {
        widgets.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        widgets.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (!isBlank(filter)) {
        widgets = widgets.filter((row) => {
            return row.title.toLowerCase().includes(filter.toLocaleLowerCase());
        });
    }

    if (isLoading) {
        return null;
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
                    <SortButton order={sortOrder} onClick={setSortOrder} />
                    <Button minimal icon="pin" />
                    <Button minimal icon="cross" onClick={mainStore.closeWidgetToolbar} />
                </div>
                <hr />

                <div className={Classes.DIALOG_BODY}>
                    <div className={styles.buttonBar}>
                        <Button text="Prev" icon="caret-left" small={true} disabled={true} />
                        <span className={styles.currentPage}>Page 1</span>
                        <Button text="Next" icon="caret-right" small={true} disabled={true} />
                    </div>
                    <ul className={styles.widgetList}>
                        {widgets.map((widget) => (
                            <li key={widget.id}>
                                <Widget
                                    name={widget.title}
                                    // TODO - Replace this temp fix to display images
                                    // smallIconUrl={widget.value.smallIconUrl}
                                    smallIconUrl={widget.images.smallUrl}
                                />
                            </li>
                        ))}
                    </ul>
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

export const Widget: React.FC<WidgetProps> = (props) => {
    const { name, smallIconUrl } = props;

    return (
        <div className={styles.tile}>
            <img className={styles.tileIcon} src={smallIconUrl} />
            <span className={styles.tileTitle}>{name}</span>
        </div>
    );
};

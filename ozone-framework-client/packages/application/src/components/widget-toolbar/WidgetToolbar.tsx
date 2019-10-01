import styles from "./index.scss";

import React, { useMemo, useState } from "react";
import { useBehavior } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, InputGroup, Overlay } from "@blueprintjs/core";

import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { PropsBase } from "../../common";
import { SortButton, SortOrder, UserWidgetItem } from "./components";
import { classNames, handleStringChange, isBlank } from "../../utility";

const _WidgetToolbar: React.FC<PropsBase> = ({ className }) => {
    const widgetToolBarRef: React.RefObject<HTMLDivElement> = React.createRef();
    const isOpen = useBehavior(mainStore.isWidgetToolbarOpen);
    const themeClass = useBehavior(mainStore.themeClass);

    const userDashboards = useBehavior(dashboardStore.userDashboards);

    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const userWidgets = useMemo(() => {
        let _userWidgets = values(userDashboards.widgets)
            .filter((w) => w.widget.isVisible)
            // Remove marketplaces
            .filter(
                (w) => !(w.widget.types && w.widget.types.length === 1 && w.widget.types[0].name === "marketplace")
            );

        if (sortOrder === "asc") {
            _userWidgets.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            _userWidgets.sort((a, b) => b.title.localeCompare(a.title));
        }
        if (!isBlank(filter)) {
            _userWidgets = _userWidgets.filter((row) => {
                return row.title.toLowerCase().includes(filter.toLocaleLowerCase());
            });
        }
        return _userWidgets;
    }, [userDashboards, sortOrder, filter, isOpen]);

    const widgetItems = useMemo(
        () =>
            userWidgets.map((userWidget) => (
                <li key={userWidget.id}>
                    <UserWidgetItem userWidget={userWidget} widgetToolBarRef={widgetToolBarRef} />
                </li>
            )),
        [userWidgets]
    );

    return (
        <Overlay
            isOpen={isOpen}
            hasBackdrop={false}
            canOutsideClickClose={true}
            canEscapeKeyClose={true}
            onClose={mainStore.closeWidgetToolbar}
            className={Classes.OVERLAY_SCROLL_CONTAINER}
        >
            <div
                className={classNames(styles.toolbar, className, themeClass)}
                data-element-id="widgets-dialog"
                ref={widgetToolBarRef}
            >
                <h3 className={styles.toolbarTitle}>Widgets</h3>
                <div className={styles.toolbarMenu}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        round={true}
                        value={filter}
                        onChange={handleStringChange(setFilter)}
                        data-element-id="widget-search-field"
                    />
                    <SortButton order={sortOrder} onClick={setSortOrder} />
                    <Button minimal icon="cross" onClick={mainStore.closeWidgetToolbar} />
                </div>
                <hr />

                <div className={Classes.DIALOG_BODY}>
                    <div className={styles.buttonBar}>
                        <Button text="Prev" icon="caret-left" small={true} disabled={true} />
                        <span className={styles.currentPage}>Page 1</span>
                        <Button text="Next" icon="caret-right" small={true} disabled={true} />
                    </div>
                    <ul className={styles.widgetList}>{widgetItems}</ul>
                </div>
            </div>
        </Overlay>
    );
};

export const WidgetToolbar = React.memo(_WidgetToolbar);

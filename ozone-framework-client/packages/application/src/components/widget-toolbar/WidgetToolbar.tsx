import * as styles from "./index.scss";

import * as React from "react";
import { useMemo, useState } from "react";
import { useBehavior } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, InputGroup, Overlay } from "@blueprintjs/core";

import { ConfirmationDialog } from "../confirmation-dialog/ConfirmationDialog";
import { mainStore } from "../../stores/MainStore";
import { dashboardStore } from "../../stores/DashboardStore";
import { dashboardService } from "../../stores/DashboardService";
import { UserWidget } from "../../models/UserWidget";

import { PropsBase } from "../../common";
import { SortButton, SortOrder } from "./SortButton";

import { classNames, handleStringChange, isBlank } from "../../utility";
import { userWidgetApi } from "../../api/clients/UserWidgetAPI";

export const WidgetToolbar: React.FC<PropsBase> = ({ className }) => {
    const isOpen = useBehavior(mainStore.isWidgetToolbarOpen);
    const themeClass = useBehavior(mainStore.themeClass);

    const userDashboards = useBehavior(dashboardStore.userDashboards);

    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const userWidgets = useMemo(() => {
        let _userWidgets = values(userDashboards.widgets).filter((w) => w.widget.isVisible);

        if (sortOrder === "asc") {
            _userWidgets.sort((a, b) => a.widget.title.localeCompare(b.widget.title));
        } else {
            _userWidgets.sort((a, b) => b.widget.title.localeCompare(a.widget.title));
        }
        if (!isBlank(filter)) {
            _userWidgets = _userWidgets.filter((row) => {
                return row.widget.title.toLowerCase().includes(filter.toLocaleLowerCase());
            });
        }
        return _userWidgets;
    }, [userDashboards, sortOrder, filter]);

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
                        {userWidgets.map((userWidget) => (
                            <li key={userWidget.id}>
                                <UserWidgetTile userWidget={userWidget} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Overlay>
    );
};

export interface WidgetProps {
    userWidget: UserWidget;
}

export const UserWidgetTile: React.FC<WidgetProps> = ({ userWidget }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    return (
        <div
            className={styles.tile}
            onMouseEnter={() => setShowDeleteButton(true)}
            onMouseLeave={() => setShowDeleteButton(false)}
        >
            <div className={styles.subtile} onClick={() => dashboardService.addWidget(userWidget)}>
                <img className={styles.tileIcon} src={userWidget.widget.images.smallUrl} />
                <span className={styles.tileTitle}>{userWidget.widget.title}</span>
            </div>
            <div>
                {showDeleteButton ? (
                    userWidget.isGroupWidget ? (
                        <Button
                            icon="trash"
                            small
                            disabled={userWidget.isGroupWidget}
                            title="You may not delete this widget because it is required by a dashboard or it belongs to a group."
                        />
                    ) : (
                        <Button
                            icon="trash"
                            minimal
                            small
                            data-element-id="widget-delete"
                            onClick={() => setShowConfirmDelete(true)}
                        />
                    )
                ) : null}
                <ConfirmationDialog
                    show={showConfirmDelete}
                    title="Warning"
                    content={`This action will permanently delete <strong>${
                        userWidget.widget.title
                    }</strong> from your available widgets!`}
                    confirmHandler={() =>
                        userWidgetApi.deleteUserWidget(userWidget.widget.id).then(() => {
                            dashboardStore.fetchUserDashboards();
                        })
                    }
                    cancelHandler={() => setShowConfirmDelete(false)}
                    payload={userWidget}
                />
            </div>
        </div>
    );
};

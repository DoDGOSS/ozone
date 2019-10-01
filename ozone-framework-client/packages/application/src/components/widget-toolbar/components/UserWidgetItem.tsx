import styles from "../index.scss";

import React, { useCallback, useState } from "react";
import { Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

import { assetUrl } from "../../../environment";
import { useToggleable } from "../../../hooks";
import { UserWidget } from "../../../models/UserWidget";
import { dashboardService } from "../../../services/DashboardService";
import { userWidgetService } from "../../../services/UserWidgetService";
import { dashboardStore } from "../../../stores/DashboardStore";

import { DeleteWidgetButton } from "./DeleteWidgetButton";
import { showMarkdownDialog } from "./MarkdownConfirmationDialog";
import { UserWidgetTile } from "./UserWidgetTile";

export interface UserWidgetItemProps {
    userWidget: UserWidget;
    widgetToolBarRef: React.RefObject<HTMLDivElement>;
}

const _UserWidgetItem: React.FC<UserWidgetItemProps> = ({ userWidget, widgetToolBarRef }) => {
    const deleteButton = useToggleable(false);
    const [widgetToolBarMaxWidth, setWidgetToolBarMaxWidth] = useState(300);

    function handleOnMouseEnter() {
        deleteButton.show();
        if (widgetToolBarRef && widgetToolBarRef.current) {
            setWidgetToolBarMaxWidth(widgetToolBarRef.current.clientWidth);
        }
    }

    const onDelete = useCallback(() => {
        userWidgetService
            .deleteUserWidget(
                userWidget,
                showDeleteDependenciesConfirmation(userWidget),
                showDeleteWidgetConfirmation(userWidget),
                showGroupDependenciesFailureNotice(userWidget)
            )
            .then((isDeleted) => {
                if (isDeleted) dashboardStore.fetchUserDashboards();
            });
    }, [userWidget]);

    const addWidget = useCallback(() => {
        dashboardService.addWidget({ widget: userWidget });
    }, [userWidget]);

    const widget = userWidget.widget;

    return (
        <div className={styles.tile} onMouseEnter={handleOnMouseEnter} onMouseLeave={deleteButton.hide}>
            <div style={{ width: "100%" }}>
                <Popover
                    interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
                    position={Position.RIGHT}
                    modifiers={{
                        arrow: { enabled: false },
                        offset: { enabled: true, offset: "0,-100% + " + widgetToolBarMaxWidth + " - 20" },
                        preventOverflow: { enabled: true, padding: 5 },
                        keepTogether: { enabled: true }
                    }}
                    content={
                        <div id="popoverdiv" className={styles.popoverdiv}>
                            <p>Version: {widget.version}</p>
                            <p>Description: {widget.description}</p>
                        </div>
                    }
                >
                    <UserWidgetTile
                        userWidgetId={userWidget.id}
                        title={widget.title}
                        iconUrl={assetUrl(widget.images.smallUrl)}
                        onClick={addWidget}
                    />
                </Popover>
            </div>
            <DeleteWidgetButton
                isVisible={deleteButton.isVisible}
                isGroupWidget={userWidget.isGroupWidget}
                onClick={onDelete}
            />
        </div>
    );
};

export const UserWidgetItem = React.memo(_UserWidgetItem);

function showDeleteWidgetConfirmation(userWidget: UserWidget) {
    return () => {
        const widgetTitle = userWidget.widget.title;

        return showMarkdownDialog({
            title: "Warning",
            text: `This action will permanently delete __${widgetTitle}__ from your available widgets!`,
            confirmText: "Delete",
            confirmIntent: Intent.DANGER
        });
    };
}

function showDeleteDependenciesConfirmation(userWidget: UserWidget) {
    return (dependencies: UserWidget[]) => {
        const widgetTitle = userWidget.widget.title;

        let text = `This action will permanently delete __${widgetTitle}__ from your available widgets!\n\n`;
        text += "The following dependent widgets will also be deleted:\n\n";
        for (const dep of dependencies) {
            text += `* __${dep.widget.title}__\n`;
        }

        return showMarkdownDialog({
            title: "Warning",
            text,
            confirmText: "Delete",
            confirmIntent: Intent.DANGER
        });
    };
}

function showGroupDependenciesFailureNotice(userWidget: UserWidget) {
    return (dependencies: UserWidget[]) => {
        const widgetTitle = userWidget.widget.title;

        let text = `Unable to delete __${widgetTitle}__.\n\n`;
        text += "The following dependent widgets were added by a group and may not be deleted:\n\n";
        for (const dep of dependencies) {
            text += `* __${dep.widget.title}__\n`;
        }

        return showMarkdownDialog({
            title: "Error",
            text,
            cancelEnabled: false
        });
    };
}

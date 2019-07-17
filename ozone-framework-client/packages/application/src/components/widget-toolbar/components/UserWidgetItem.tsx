import styles from "../index.scss";

import React, { useCallback } from "react";
import { Intent } from "@blueprintjs/core";

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
}

const _UserWidgetItem: React.FC<UserWidgetItemProps> = ({ userWidget }) => {
    const deleteButton = useToggleable(false);

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
        <div className={styles.tile} onMouseEnter={deleteButton.show} onMouseLeave={deleteButton.hide}>
            <UserWidgetTile
                userWidgetId={userWidget.id}
                title={widget.title}
                iconUrl={assetUrl(widget.images.smallUrl)}
                onClick={addWidget}
            />
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

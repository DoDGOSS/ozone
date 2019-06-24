import styles from "../index.scss";

import React, { useCallback } from "react";
import { useToggleable } from "../../../hooks";

import { assetUrl } from "../../../environment";
import { userWidgetApi } from "../../../api/clients/UserWidgetAPI";
import { UserWidget } from "../../../models/UserWidget";
import { dashboardService } from "../../../services/DashboardService";
import { dashboardStore } from "../../../stores/DashboardStore";

import { DeleteWidgetButton } from "./DeleteWidgetButton";
import { MarkdownConfirmationDialog } from "./MarkdownConfirmationDialog";
import { UserWidgetTile } from "./UserWidgetTile";

export interface UserWidgetItemProps {
    userWidget: UserWidget;
}

const _UserWidgetItem: React.FC<UserWidgetItemProps> = ({ userWidget }) => {
    const deleteButton = useToggleable(false);
    const deleteConfirmation = useToggleable(false);

    const addWidget = useCallback(() => {
        dashboardService.addWidget({ widget: userWidget });
    }, [userWidget]);

    const deleteWidget = useCallback(() => {
        deleteConfirmation.hide();

        userWidgetApi.deleteUserWidget(userWidget.widget.id).then(() => dashboardStore.fetchUserDashboards());
    }, [deleteConfirmation, userWidget]);

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
                onClick={deleteConfirmation.show}
            />
            <MarkdownConfirmationDialog
                isOpen={deleteConfirmation.isVisible}
                title="Warning"
                text={`This action will permanently delete __${userWidget.widget.title}__ from your available widgets!`}
                onConfirm={deleteWidget}
                onCancel={deleteConfirmation.hide}
            />
        </div>
    );
};

export const UserWidgetItem = React.memo(_UserWidgetItem);

import React from "react";
import { Button } from "@blueprintjs/core";

export interface DeleteWidgetButtonProps {
    isVisible: boolean;
    isGroupWidget: boolean;
    onClick: () => void;
}

const _DeleteWidgetButton: React.FC<DeleteWidgetButtonProps> = (props) => {
    if (!props.isVisible) return null;

    return (
        <Button
            data-element-id="widget-delete"
            disabled={props.isGroupWidget}
            onClick={props.onClick}
            icon="trash"
            minimal
            small
            title={
                props.isGroupWidget
                    ? "You may not delete this widget because it is required by a dashboard or it belongs to a group."
                    : undefined
            }
        />
    );
};

export const DeleteWidgetButton = React.memo(_DeleteWidgetButton);

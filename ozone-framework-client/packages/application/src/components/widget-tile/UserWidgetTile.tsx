import React, { useCallback, useMemo } from "react";

import { UserWidget } from "../../models/UserWidget";

import { WidgetTile } from "./WidgetTile";

export interface UserWidgetTileProps {
    isSelected?: boolean;
    onClick?: (id: number) => void;
    onClose?: (id: number) => void;
    userWidget: UserWidget;
}

const _UserWidgetTile: React.FC<UserWidgetTileProps> = (props) => {
    const { isSelected, onClick, onClose, userWidget } = props;

    const { title, widget } = userWidget;
    const isBackground = widget.isBackground;
    const iconUrl = widget.images.largeUrl;

    const _onClick = useCallback(() => {
        if (onClick) onClick(userWidget.id);
    }, [userWidget, onClick]);

    const _onClose = useMemo(() => {
        if (!onClose) return undefined;
        return () => {
            onClose(userWidget.id);
        };
    }, [userWidget, onClose]);

    return (
        <WidgetTile
            iconUrl={iconUrl}
            isBackground={isBackground}
            isSelected={isSelected}
            onClick={_onClick}
            onClose={_onClose}
            title={title}
        />
    );
};
export const UserWidgetTile = React.memo(_UserWidgetTile);
UserWidgetTile.displayName = "UserWidgetTile";

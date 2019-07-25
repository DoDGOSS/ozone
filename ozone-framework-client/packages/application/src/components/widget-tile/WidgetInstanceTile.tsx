import React, { useCallback, useMemo } from "react";

import { WidgetInstance } from "../../models/WidgetInstance";

import { WidgetTile } from "./WidgetTile";

export interface WidgetInstanceTileProps {
    isSelected?: boolean;
    onClick?: (id: string) => void;
    onClose?: (id: string) => void;
    widgetInstance: WidgetInstance;
}

const _WidgetInstanceTile: React.FC<WidgetInstanceTileProps> = (props) => {
    const { isSelected, onClick, onClose, widgetInstance } = props;

    const { title, widget } = widgetInstance.userWidget;
    const isBackground = widget.isBackground;
    const iconUrl = widget.images.largeUrl;

    const _onClick = useCallback(() => {
        if (onClick) onClick(widgetInstance.id);
    }, [widgetInstance, onClick]);

    const _onClose = useMemo(() => {
        if (!onClose) return undefined;
        return () => {
            onClose(widgetInstance.id);
        };
    }, [widgetInstance, onClose]);

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
export const WidgetInstanceTile = React.memo(_WidgetInstanceTile);
WidgetInstanceTile.displayName = "WidgetInstanceTile";

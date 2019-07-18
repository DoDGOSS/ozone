import styles from "./index.module.scss";

import React from "react";
import { Button, Icon } from "@blueprintjs/core";

import { assetUrl } from "../../environment";
import { WidgetInstance } from "../../models/WidgetInstance";
import { classNames } from "../../utility";

export type WidgetTileProps = {
    widgetInstance: WidgetInstance;
    onClick: (instanceId: string) => void;
    onClose: (instanceId: string) => void;
};

export const WidgetTile: React.FC<WidgetTileProps> = (props) => {
    const { onClick, onClose, widgetInstance } = props;

    const { title, widget } = widgetInstance.userWidget;
    const isBackground = widget.isBackground;
    const iconUrl = widget.images.largeUrl;

    return (
        <div
            className={classNames(styles.tile, { [styles.background]: isBackground })}
            onClick={() => onClick(widgetInstance.id)}
        >
            {isBackground && (
                <>
                    <Icon icon="eye-off" className={styles.backgroundIndicator} htmlTitle="Background Widget" />
                    <Button
                        minimal
                        icon="cross"
                        className={styles.closeButton}
                        onClick={() => onClose(widgetInstance.id)}
                    />
                </>
            )}
            <img className={styles.tileIcon} src={assetUrl(iconUrl)} />
            <span className={styles.tileTitle}>{title}</span>
        </div>
    );
};

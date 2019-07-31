import styles from "./index.module.scss";

import React from "react";
import { Button, Icon } from "@blueprintjs/core";

import { assetUrl } from "../../environment";
import { classNames } from "../../utility";

export interface WidgetTileProps {
    iconUrl: string;
    isBackground: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    onClose?: () => void;
    title: string;
}

const _WidgetTile: React.FC<WidgetTileProps> = (props) => {
    const { iconUrl, isBackground, isSelected, onClick, onClose, title } = props;

    return (
        <div
            className={classNames(styles.tile, { [styles.background]: isBackground, [styles.selected]: isSelected })}
            onClick={onClick}
            data-element-id={title}
        >
            {isBackground && (
                <Icon icon="eye-off" className={styles.backgroundIndicator} htmlTitle="Background Widget" />
            )}
            {isBackground && onClose && (
                <Button minimal icon="cross" className={styles.closeButton} onClick={onClose} />
            )}

            <img className={styles.tileIcon} src={assetUrl(iconUrl)} />
            <span className={styles.tileTitle}>{title}</span>
        </div>
    );
};

export const WidgetTile = React.memo(_WidgetTile);
WidgetTile.displayName = "WidgetTile";

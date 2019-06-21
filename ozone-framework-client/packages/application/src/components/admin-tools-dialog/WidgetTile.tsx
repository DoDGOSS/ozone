import * as styles from "./index.scss";

import * as React from "react";

import { assetUrl } from "../../environment";

export type WidgetTileProps = {
    title: string;
    iconUrl: string;
    onClick: () => void;
};

export const WidgetTile: React.FC<WidgetTileProps> = (props) => {
    const { title, iconUrl, onClick } = props;

    return (
        <div className={styles.tile} data-element-id={title} onClick={onClick}>
            <img className={styles.tileIcon} src={assetUrl(iconUrl)} />
            <span className={styles.tileTitle}>{title}</span>
        </div>
    );
};

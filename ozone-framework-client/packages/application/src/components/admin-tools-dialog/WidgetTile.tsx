import * as React from "react";

import * as styles from "./index.scss";

export type WidgetTileProps = {
    title: string;
    iconUrl: string;
    onClick: () => void;
};

export const WidgetTile: React.FunctionComponent<WidgetTileProps> = (props) => {
    const { title, iconUrl, onClick } = props;

    return (
        <div className={styles.tile} data-element-id={title}>
            <button onClick={onClick}>
                <img className={styles.tileIcon} src={iconUrl} />
                <span className={styles.tileTitle}>{title}</span>
            </button>
        </div>
    );
};

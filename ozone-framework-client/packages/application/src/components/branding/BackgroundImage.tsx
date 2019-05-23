import * as React from "react";

import * as styles from "./index.scss";

export interface BackgroundImageProps {
    imgUrl: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = (props) => {
    const { imgUrl } = props;

    return (
        <div className={styles.fullcenter} data-element-id="custom-background-image">
            <img src={imgUrl} />
        </div>
    );
};

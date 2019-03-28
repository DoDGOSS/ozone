import * as React from "react";

import * as styles from "./index.scss";

export interface ClassificationBannerProps {
    text: string;
    backgroundColor: string;
    foregroundColor: string;
}

export const ClassificationBanner: React.FC<ClassificationBannerProps> = (props) => {
    const { text, backgroundColor, foregroundColor } = props;

    return (
        <div
            className={styles.banner}
            style={{
                color: foregroundColor,
                backgroundColor
            }}
            data-element-id="classification-banner"
        >
            {text}
        </div>
    );
};

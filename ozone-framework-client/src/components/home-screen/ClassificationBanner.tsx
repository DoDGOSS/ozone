import * as styles from "./ClassificationBanner.scss";

import * as React from "react";

import { classNames } from "../util";


export interface ClassificationBannerProps {
    text: string;
    backgroundColor: string;
    foregroundColor: string;

    className?: string;
}

export const ClassificationBanner: React.FunctionComponent<ClassificationBannerProps> = (props) => {
    const { className, text, backgroundColor, foregroundColor } = props;

    return (
        <div className={classNames(styles.classificationBanner, className)}
             style={{
                 color: foregroundColor,
                 backgroundColor
             }}
             data-element-id="classification-banner">
            {text}
        </div>
    );
};

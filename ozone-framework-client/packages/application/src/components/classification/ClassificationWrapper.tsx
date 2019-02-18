import * as React from "react";
import { useBehavior } from "../../hooks";

import { configStore } from "../../stores/ConfigStore";

import { ClassificationBanner } from "./ClassificationBanner";

import * as styles from "./index.scss";

export const ClassificationWrapper: React.FunctionComponent<{}> = ({ children }) => {
    const classification = useBehavior(configStore.classification);

    return (
        <div className={styles.wrapper}>
            {classification.disableTopBanner !== true && <ClassificationBanner {...classification} />}

            <div className={styles.container}>{children}</div>

            {classification.disableBottomBanner !== true && <ClassificationBanner {...classification} />}
        </div>
    );
};

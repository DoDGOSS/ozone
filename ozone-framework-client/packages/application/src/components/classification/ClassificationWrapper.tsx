import styles from "./index.scss";

import React from "react";
import { useBehavior } from "../../hooks";

import { configStore } from "../../stores/ConfigStore";
import { Header } from "../branding/Header";
import { Footer } from "../branding/Footer";
import { ClassificationBanner } from "./ClassificationBanner";

export const ClassificationWrapper: React.FC<{}> = ({ children }) => {
    const classification = useBehavior(configStore.classification);

    return (
        <div className={styles.wrapper}>
            {classification.disableTopBanner !== true && <ClassificationBanner {...classification} />}

            <Header />

            <div className={styles.container}>{children}</div>

            <Footer />

            {classification.disableBottomBanner !== true && <ClassificationBanner {...classification} />}
        </div>
    );
};

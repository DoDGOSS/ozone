import styles from "./index.scss";

import React from "react";
import { useBehavior } from "../../hooks";

import { systemConfigStore } from "../../stores/SystemConfigStore";

export const Footer: React.FC = () => {
    const footerHeight = useBehavior(systemConfigStore.footerHeight);
    const footerBody = useBehavior(systemConfigStore.footerBody);

    const height = footerHeight !== undefined ? footerHeight : "0";

    return (
        <div className={styles.banner} style={{ height: height + "px" }}>
            {footerBody !== undefined ? (
                <div data-element-id="sysconfig-custom-footer" dangerouslySetInnerHTML={{ __html: footerBody }}>
                    {null}
                </div>
            ) : (
                <div data-element-id="no-custom-footer-provided" />
            )}
        </div>
    );
};

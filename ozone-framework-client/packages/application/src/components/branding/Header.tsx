import styles from "./index.scss";

import React from "react";
import { useBehavior } from "../../hooks";

import { systemConfigStore } from "../../stores/SystemConfigStore";

export const Header: React.FC = () => {
    const headerHeight = useBehavior(systemConfigStore.headerHeight);
    const headerBody = useBehavior(systemConfigStore.headerBody);

    const height = headerHeight !== undefined ? headerHeight : "0";

    return (
        <div className={styles.banner} style={{ height: height + "px" }}>
            {headerBody !== undefined ? (
                <div data-element-id="sysconfig-custom-header" dangerouslySetInnerHTML={{ __html: headerBody }}>
                    {null}
                </div>
            ) : (
                <div data-element-id="no-custom-header-provided" />
            )}
        </div>
    );
};

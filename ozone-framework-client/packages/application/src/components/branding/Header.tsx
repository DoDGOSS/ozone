import * as React from "react";

import * as styles from "./index.scss";
import { useBehavior } from "../../hooks";
import { systemConfigStore } from "../../stores/SystemConfigStore";

export const Header: React.FC = () => {
    const headerHeight = useBehavior(systemConfigStore.headerHeight) + "px";
    const headerBody = useBehavior(systemConfigStore.headerBody);

    return (
        <div className={styles.banner} style={{ height: headerHeight }}>
            {headerBody !== "" ? (
                <div data-element-id="sysconfig-custom-header" dangerouslySetInnerHTML={{ __html: headerBody! }}>
                    {null}
                </div>
            ) : (
                <div data-element-id="no-custom-header-provided">{null}</div>
            )}
        </div>
    );
};

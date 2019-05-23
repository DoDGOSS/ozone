import * as React from "react";

import * as styles from "./index.scss";
import { useBehavior } from "../../hooks";
import { systemConfigStore } from "../../stores/SystemConfigStore";

export const Footer: React.FC = () => {
    const footerHeight = useBehavior(systemConfigStore.footerHeight) + "px";
    const footerBody = useBehavior(systemConfigStore.footerBody);

    return (
        <div className={styles.banner} style={{ height: footerHeight }}>
            {footerBody !== "" ? (
                <div data-element-id="sysconfig-custom-footer" dangerouslySetInnerHTML={{ __html: footerBody! }}>
                    {null}
                </div>
            ) : (
                <div data-element-id="no-custom-footer-provided">{null}</div>
            )}
        </div>
    );
};

import styles from "../index.scss";

import React, { useCallback, useState } from "react";
import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

import { assetUrl } from "../../../environment";
import { useToggleable } from "../../../hooks";
import { UserWidget } from "../../../models/UserWidget";
import { dashboardService } from "../../../services/DashboardService";

import { UserWidgetTile } from "./UserWidgetTile";

export interface UserWidgetItemProps {
    userWidget: UserWidget;
    widgetToolBarRef: React.RefObject<HTMLDivElement>;
}

const _UserWidgetItem: React.FC<UserWidgetItemProps> = ({ userWidget, widgetToolBarRef }) => {
    const [widgetToolBarMaxWidth, setWidgetToolBarMaxWidth] = useState(300);

    function handleOnMouseEnter() {
        if (widgetToolBarRef && widgetToolBarRef.current) {
            setWidgetToolBarMaxWidth(widgetToolBarRef.current.clientWidth);
        }
    }

    const addWidget = useCallback(() => {
        dashboardService.addWidget({ widget: userWidget });
    }, [userWidget]);

    const widget = userWidget.widget;

    return (
        <div className={styles.tile} onMouseEnter={handleOnMouseEnter}>
            <div style={{ width: "100%" }}>
                <Popover
                    interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
                    position={Position.RIGHT}
                    modifiers={{
                        arrow: { enabled: false },
                        offset: { enabled: true, offset: "0,-100% + " + widgetToolBarMaxWidth + " - 20" },
                        preventOverflow: { enabled: true, padding: 5 },
                        keepTogether: { enabled: true }
                    }}
                    content={
                        <div id="popoverdiv" className={styles.popoverdiv}>
                            <p>Version: {widget.version}</p>
                            <p>Description: {widget.description}</p>
                        </div>
                    }
                >
                    <UserWidgetTile
                        userWidgetId={userWidget.id}
                        title={widget.title}
                        iconUrl={assetUrl(widget.images.smallUrl)}
                        onClick={addWidget}
                    />
                </Popover>
            </div>
        </div>
    );
};

export const UserWidgetItem = React.memo(_UserWidgetItem);

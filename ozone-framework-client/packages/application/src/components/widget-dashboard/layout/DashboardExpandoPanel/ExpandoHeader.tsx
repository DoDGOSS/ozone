import styles from "./index.module.scss";

import React, { useCallback, useMemo } from "react";
import { useBehavior } from "../../../../hooks";
import { DragSource } from "react-dnd";
import { Button } from "@blueprintjs/core";

import { dragDropService } from "../../../../stores/DragDropService";
import {
    beginWidgetDrag,
    collectDragProps,
    DragDataType,
    DragSourceProps,
    endWidgetDrag,
    MosaicDragType
} from "../../../../shared/dragAndDrop";

import { ExpandoPanel } from "../../../../models/panel";
import { WidgetInstance } from "../../../../models/WidgetInstance";

export interface ExpandoHeaderProps {
    panel: ExpandoPanel;
    widget: WidgetInstance;
    collapsed: boolean;
}

type ExpandoHeaderDndProps = ExpandoHeaderProps & DragSourceProps;

const _ExpandoHeader: React.FC<ExpandoHeaderDndProps> = (props) => {
    const { panel, widget, collapsed, connectDragSource } = props;

    const { widgets } = useBehavior(panel.state);
    const moveControls = useMemo(() => panel.getMoveControls(widget), [widgets]);

    const collapseIcon = collapsed ? "plus" : "minus";
    const toggleCollapsed = useCallback(() => panel.setCollapsed(widget.id, !collapsed), [widget, collapsed]);
    const closeWidget = useCallback(() => panel.closeWidget(widget.id), [panel, widget]);

    return connectDragSource(
        <div className={styles.header} draggable={true}>
            <span className={styles.headerTitle}>{widget.userWidget.title}</span>
            <span className={styles.headerControls}>
                <Button
                    className={styles.headerButton}
                    icon="chevron-up"
                    minimal={true}
                    disabled={!moveControls.canMoveUp}
                    onClick={moveControls.moveUp}
                />
                <Button
                    className={styles.headerButton}
                    icon="chevron-down"
                    minimal={true}
                    disabled={!moveControls.canMoveDown}
                    onClick={moveControls.moveDown}
                />
                <Button className={styles.headerButton} icon={collapseIcon} minimal={true} onClick={toggleCollapsed} />
                <Button className={styles.headerButton} icon="cross" minimal={true} onClick={closeWidget} />
            </span>
        </div>
    );
};

const dragSpec = {
    beginDrag: beginWidgetDrag<ExpandoHeaderDndProps>(({ props }) => {
        return {
            type: DragDataType.INSTANCE,
            widgetInstanceId: props.widget.id
        };
    }),
    endDrag: endWidgetDrag<ExpandoHeaderDndProps>(dragDropService.handleDropEvent)
};

export const ExpandoHeader = DragSource(MosaicDragType.WINDOW, dragSpec, collectDragProps)(
    _ExpandoHeader
) as React.ComponentType<ExpandoHeaderProps>;

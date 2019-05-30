import styles from "./DashboardExpandoPanel.scss";

import React, { useCallback } from "react";
import { useBehavior } from "../../../hooks";

import { DragSource } from "react-dnd";

import { Button } from "@blueprintjs/core";

import { WidgetInstance } from "../../../models/WidgetInstance";
import { ExpandoPanel } from "../../../models/panel";

import { WidgetFrame } from "../WidgetFrame";

import { dragDropService } from "../../../stores/DragDropService";
import {
    beginWidgetDrag,
    collectDragProps,
    DragDataType,
    DragSourceProps,
    endWidgetDrag,
    MosaicDragType
} from "../../../shared/dragAndDrop";

import { classNames } from "../../../utility";

export interface ExpandoHeaderProps {
    panel: ExpandoPanel;
    widget: WidgetInstance;
    collapsed: boolean;
}

type ExpandoHeaderDndProps = ExpandoHeaderProps & DragSourceProps;

const _ExpandoHeader: React.FC<ExpandoHeaderDndProps> = (props) => {
    const { panel, widget, collapsed, connectDragSource } = props;

    const collapseIcon = collapsed ? "plus" : "minus";
    const toggleCollapsed = useCallback(() => panel.setCollapsed(widget.id, !collapsed), [widget, collapsed]);
    const closeWidget = useCallback(() => panel.closeWidget(widget.id), [panel, widget]);

    return connectDragSource(
        <div className={styles.header} draggable={true}>
            <span className={styles.headerTitle}>{widget.userWidget.title}</span>
            <span className={styles.headerControls}>
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

export interface ExpandoContainerProps {
    panel: ExpandoPanel;
    widget: WidgetInstance;
    collapsed: boolean;
}

const ExpandoContainer: React.FC<ExpandoContainerProps> = ({ panel, widget, collapsed }) => {
    const classes = classNames(styles.container, { [styles.collapsed]: collapsed });

    return (
        <div className={classes}>
            <ExpandoHeader panel={panel} widget={widget} collapsed={collapsed} />
            <div className={styles.frameWrapper}>
                <WidgetFrame widgetInstance={widget} />
            </div>
        </div>
    );
};

export interface DashboardExpandoPanelProps {
    panel: ExpandoPanel;
}

export const DashboardExpandoPanel: React.FC<DashboardExpandoPanelProps> = ({ panel }) => {
    const { type, widgets, collapsed } = useBehavior(panel.state);

    const expandoClass = type === "accordion" ? styles.accordion : styles.portal;
    const classes = classNames(styles.panel, expandoClass);

    return (
        <div className={classes}>
            {widgets.map((widget, idx) => (
                <ExpandoContainer key={widget.id} panel={panel} widget={widget} collapsed={collapsed[idx]} />
            ))}
        </div>
    );
};

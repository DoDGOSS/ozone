import styles from "../index.scss";

import React from "react";
import { ConnectDragPreview, ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from "react-dnd";
import { defer } from "lodash";

import { MosaicDragType, MosaicDropData } from "../../../features/MosaicDashboard";
import { mainStore } from "../../../stores/MainStore";
import { dashboardService } from "../../../stores/DashboardService";

import { MOSAIC_CONTEXT_ID } from "../../../constants";

export interface UserWidgetTileProps {
    iconUrl: string;
    onClick: () => void;
    title: string;
    widgetId: string;
    onDragStart?: (userWidgetId: string) => void;
    onDragEnd?: (userWidgetId: string) => void;
}

export interface UserWidgetTileDragSourceProps {
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
}

interface UserWidgetDragItem {
    widgetId: string;
    hideTimerId: number;
    mosaicId: string;
}

type Props = UserWidgetTileProps & UserWidgetTileDragSourceProps;

const _InternalWidgetTile: React.FC<Props> = (props) =>
    props.connectDragSource(
        <div draggable={true} className={styles.subtile} onClick={props.onClick}>
            <img className={styles.tileIcon} src={props.iconUrl} />
            <span className={styles.tileTitle}>{props.title}</span>
        </div>
    );

const InternalWidgetTile = React.memo(_InternalWidgetTile);

export const UserWidgetTile = DragSource(
    MosaicDragType.WINDOW,
    {
        beginDrag,
        endDrag
    },
    collectDragProps
)(InternalWidgetTile);

function beginDrag(props: Props): UserWidgetDragItem {
    const { widgetId } = props;

    if (props.onDragStart) {
        props.onDragStart(widgetId);
    }

    const hideTimerId = defer(mainStore.closeWidgetToolbar);

    return {
        widgetId,
        hideTimerId,
        mosaicId: MOSAIC_CONTEXT_ID
    };
}

function endDrag(props: Props, monitor: DragSourceMonitor) {
    const item = monitor.getItem() as UserWidgetDragItem;
    const { widgetId, hideTimerId } = item;
    window.clearTimeout(hideTimerId);

    const dropResult = (monitor.getDropResult() || {}) as MosaicDropData;
    dashboardService.addUserWidgetById(widgetId, dropResult.path, dropResult.position);

    if (props.onDragEnd) {
        props.onDragEnd(widgetId);
    }
}

function collectDragProps(connect: DragSourceConnector): UserWidgetTileDragSourceProps {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview()
    };
}

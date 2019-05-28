import styles from "../index.scss";

import React from "react";
import { DragSource } from "react-dnd";

import { DropDataType, MosaicDragType } from "../../../features/MosaicDashboard";
import { mainStore } from "../../../stores/MainStore";
import { dashboardService } from "../../../stores/DashboardService";
import {
    beginWidgetDrag,
    collectDragProps,
    DragDataType,
    DragSourceProps,
    endWidgetDrag
} from "../../../shared/dragAndDrop";

export interface UserWidgetTileProps {
    iconUrl: string;
    onClick: () => void;
    title: string;
    userWidgetId: number;
}

type Props = UserWidgetTileProps & DragSourceProps;

const _InternalWidgetTile: React.FC<Props> = (props) =>
    props.connectDragSource(
        <div draggable={true} className={styles.subtile} onClick={props.onClick}>
            <img className={styles.tileIcon} src={props.iconUrl} />
            <span className={styles.tileTitle}>{props.title}</span>
        </div>
    );

const InternalWidgetTile = React.memo(_InternalWidgetTile);

const endDrag = endWidgetDrag<Props>(({ dragData, dropData }) => {
    if (dragData && dragData.type === DragDataType.WIDGET) {
        if (dropData.type == DropDataType.MOSAIC) {
            dashboardService.addUserWidgetById(dragData.userWidgetId, dropData.path, dropData.position);
        }
        else if (dropData.type == DropDataType.TABLIST) {
            dashboardService.addWidgetToTabbedPanel(dragData.userWidgetId, dropData.panelId, dropData.index);
        }
    }
});

const beginDrag = beginWidgetDrag<Props>(({ props, defer }) => {
    defer(mainStore.closeWidgetToolbar);
    return {
        type: DragDataType.WIDGET,
        userWidgetId: props.userWidgetId
    };
});

export const UserWidgetTile = DragSource(MosaicDragType.WINDOW, { beginDrag, endDrag }, collectDragProps)(
    InternalWidgetTile
) as React.ComponentType<UserWidgetTileProps>;

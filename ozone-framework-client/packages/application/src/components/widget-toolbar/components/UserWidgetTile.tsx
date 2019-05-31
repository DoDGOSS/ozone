import styles from "../index.scss";

import React from "react";
import { DragSource } from "react-dnd";

import { mainStore } from "../../../stores/MainStore";
import { dragDropService } from "../../../services/DragDropService";

import {
    beginWidgetDrag,
    collectDragProps,
    DragDataType,
    DragSourceProps,
    endWidgetDrag,
    MosaicDragType
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

const dragSpec = {
    beginDrag: beginWidgetDrag<Props>(({ props, defer }) => {
        defer(mainStore.closeWidgetToolbar);
        return {
            type: DragDataType.WIDGET,
            userWidgetId: props.userWidgetId
        };
    }),
    endDrag: endWidgetDrag<Props>(dragDropService.handleDropEvent),
    canDrag: dragDropService.canDrag
};

export const UserWidgetTile = DragSource(MosaicDragType.WINDOW, dragSpec, collectDragProps)(
    InternalWidgetTile
) as React.ComponentType<UserWidgetTileProps>;

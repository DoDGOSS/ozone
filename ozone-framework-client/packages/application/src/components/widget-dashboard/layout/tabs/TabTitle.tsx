/* tslint:disable:member-access interface-name */
/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Modifications Copyright 2019 Ozone Development Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import classNames from "classnames";
import { DragSource } from "react-dnd";

import { Classes, DISPLAYNAME_PREFIX } from "@blueprintjs/core";

import { dragDropService } from "../../../../services/DragDropService";
import {
    beginWidgetDrag,
    collectDragProps,
    DragDataType,
    DragSourceProps,
    endWidgetDrag,
    MosaicDragType
} from "../../../../shared/dragAndDrop";

import { ITabProps, TabId } from "./Tab";

export interface ITabTitleProps extends ITabProps {
    /** Handler invoked when this tab is clicked. */
    onClick: (id: TabId, event: React.MouseEvent<HTMLElement>) => void;

    /** ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes. */
    parentId: TabId;

    /** Whether the tab is currently selected. */
    selected: boolean;
}

type Props = ITabTitleProps & DragSourceProps;

export class TabTitleBase extends React.PureComponent<Props, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TabTitle`;

    public render() {
        const { connectDragSource, disabled, id, parentId, selected } = this.props;
        return connectDragSource(
            <div
                aria-controls={generateTabPanelId(parentId, id)}
                aria-disabled={disabled}
                aria-expanded={selected}
                aria-selected={selected}
                className={classNames(Classes.TAB, this.props.className)}
                data-tab-id={id}
                draggable={true}
                id={generateTabTitleId(parentId, id)}
                onClick={disabled ? undefined : this.handleClick}
                role="tab"
                tabIndex={disabled ? undefined : 0}
            >
                {this.props.title}
                {this.props.children}
            </div>
        );
    }

    private handleClick = (e: React.MouseEvent<HTMLElement>) => this.props.onClick(this.props.id, e);
}

export function generateTabPanelId(parentId: TabId, tabId: TabId) {
    return `${Classes.TAB_PANEL}_${parentId}_${tabId}`;
}

export function generateTabTitleId(parentId: TabId, tabId: TabId) {
    return `${Classes.TAB}-title_${parentId}_${tabId}`;
}

const dragSpec = {
    beginDrag: beginWidgetDrag<Props>(({ props }) => {
        return {
            type: DragDataType.INSTANCE,
            widgetInstanceId: props.widgetInstanceId
        };
    }),
    endDrag: endWidgetDrag<Props>(dragDropService.handleDropEvent),
    canDrag: dragDropService.canDrag
};

export const TabTitle = DragSource(MosaicDragType.WINDOW, dragSpec, collectDragProps)(
    TabTitleBase
) as React.ComponentType<ITabTitleProps>;

/* tslint:disable:member-ordering */

import React from "react";
import { Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { ConnectableElement, DragSource } from "react-dnd";

import { dragDropService } from "../../services/DragDropService";
import {
    beginWidgetDrag,
    collectDragProps,
    DragDataType,
    DragSourceProps,
    DropTargetProps,
    endWidgetDrag,
    MosaicDragType
} from "../../shared/dragAndDrop";

import { DEFAULT_CONTROLS_WITH_CREATION, DEFAULT_CONTROLS_WITHOUT_CREATION } from "./buttons/defaultToolbarControls";
import { Separator } from "./buttons/Separator";
import {
    ModernMosaicWindowContext,
    MosaicContext,
    MosaicWindowActionsPropType,
    MosaicWindowContext
} from "./contextTypes";
import { CreateNode, MosaicBranch, MosaicDirection, MosaicKey } from "./types";
import { getAndAssertNodeAtPathExists } from "./util/mosaicUtilities";
import { getBlueprintClasses, getBlueprintIconClass } from "./util/blueprint";
import { DropTargetContainer } from "./DropTargetContainer";

export interface MosaicWindowProps<T extends MosaicKey> {
    title: string;
    titleClassname?: string;
    titleElement?: React.ReactNode;
    path: MosaicBranch[];
    className?: string;
    toolbarControls?: React.ReactNode;
    additionalControls?: React.ReactNode;
    additionalControlButtonText?: string;
    draggable?: boolean;
    createNode?: CreateNode<T>;
    renderPreview?: (props: MosaicWindowProps<T>) => JSX.Element;
    renderToolbar?: ((props: MosaicWindowProps<T>, draggable: boolean | undefined) => JSX.Element) | null;
    onDragStart?: () => void;
    onDragEnd?: (type: "drop" | "reset") => void;
}

export type InternalMosaicWindowProps<T extends MosaicKey> = MosaicWindowProps<T> & DropTargetProps & DragSourceProps;

export interface InternalMosaicWindowState {
    additionalControlsOpen: boolean;
}

export class InternalMosaicWindow<T extends MosaicKey> extends React.Component<
    InternalMosaicWindowProps<T>,
    InternalMosaicWindowState
> {
    static defaultProps: Partial<InternalMosaicWindowProps<any>> = {
        additionalControlButtonText: "More",
        draggable: true,
        renderPreview: ({ title }) => (
            <div className="mosaic-preview">
                <div className="mosaic-window-toolbar">
                    <div className="mosaic-window-title">{title}</div>
                </div>
                <div className="mosaic-window-body">
                    <h4>{title}</h4>
                    <Icon iconSize={72} icon="application" />
                </div>
            </div>
        ),
        renderToolbar: null
    };

    static contextTypes = MosaicContext;

    static childContextTypes = {
        mosaicWindowActions: MosaicWindowActionsPropType
    };

    state: InternalMosaicWindowState = {
        additionalControlsOpen: false
    };
    context!: MosaicContext<T>;

    private rootElement = React.createRef<HTMLDivElement>();

    getChildContext(): Partial<MosaicWindowContext<T>> {
        return this.childContext;
    }

    render() {
        const { className, renderPreview, additionalControls, connectDragPreview, path } = this.props;

        return (
            <ModernMosaicWindowContext.Provider value={this.childContext}>
                <DropTargetContainer
                    className={classNames("mosaic-window", className, {
                        "additional-controls-open": this.state.additionalControlsOpen
                    })}
                    path={path}
                    forwardRef={this.rootElement}
                >
                    {this.renderToolbar()}
                    <div className="mosaic-window-body">{this.props.children!}</div>
                    <div className="mosaic-window-body-overlay" onClick={() => this.setAdditionalControlsOpen(false)} />
                    <div className="mosaic-window-additional-actions-bar">{additionalControls}</div>
                    {connectDragPreview(renderPreview!(this.props))}
                </DropTargetContainer>
            </ModernMosaicWindowContext.Provider>
        );
    }

    private getToolbarControls() {
        const { toolbarControls, createNode } = this.props;
        if (toolbarControls) {
            return toolbarControls;
        } else if (createNode) {
            return DEFAULT_CONTROLS_WITH_CREATION;
        } else {
            return DEFAULT_CONTROLS_WITHOUT_CREATION;
        }
    }

    private renderToolbar() {
        const {
            title,
            titleClassname,
            titleElement,
            draggable,
            additionalControls,
            additionalControlButtonText,
            connectDragSource,
            path,
            renderToolbar
        } = this.props;
        const { additionalControlsOpen } = this.state;
        const toolbarControls = this.getToolbarControls();
        const draggableAndNotRoot = draggable && path.length > 0;

        if (renderToolbar) {
            const connectedToolbar = connectDragSource(renderToolbar(this.props, draggable)) as React.ReactElement<any>;
            return (
                <div className={classNames("mosaic-window-toolbar", { draggable: draggableAndNotRoot })}>
                    {connectedToolbar}
                </div>
            );
        }

        let titleDiv: React.ReactElement<any> = (
            <div title={title} className={classNames("mosaic-window-title", titleClassname)}>
                {titleElement || title}
            </div>
        );

        if (draggableAndNotRoot) {
            titleDiv = connectDragSource(titleDiv) as React.ReactElement<any>;
        }

        const hasAdditionalControls = !isEmpty(additionalControls);

        return (
            <div className={classNames("mosaic-window-toolbar", { draggable: draggableAndNotRoot })}>
                {titleDiv}
                <div className={classNames("mosaic-window-controls", getBlueprintClasses("BUTTON_GROUP"))}>
                    {hasAdditionalControls && (
                        <button
                            onClick={() => this.setAdditionalControlsOpen(!additionalControlsOpen)}
                            className={classNames(
                                getBlueprintClasses("BUTTON", "MINIMAL"),
                                getBlueprintIconClass("MORE"),
                                {
                                    [getBlueprintClasses("ACTIVE")]: additionalControlsOpen
                                }
                            )}
                        >
                            <span className="control-text">{additionalControlButtonText!}</span>
                        </button>
                    )}
                    {hasAdditionalControls && <Separator />}
                    {toolbarControls}
                </div>
            </div>
        );
    }

    private checkCreateNode() {
        if (this.props.createNode == null) {
            throw new Error("Operation invalid unless `createNode` is defined");
        }
    }

    private split = (...args: any[]) => {
        this.checkCreateNode();
        const { createNode, path } = this.props;
        const { mosaicActions } = this.context;
        const root = mosaicActions.getRoot();

        const direction: MosaicDirection =
            this.rootElement.current!.offsetWidth > this.rootElement.current!.offsetHeight ? "row" : "column";

        return Promise.resolve(createNode!(...args)).then((second) =>
            mosaicActions.replaceWith(path, {
                direction,
                second,
                first: getAndAssertNodeAtPathExists(root, path)
            })
        );
    };

    private swap = (...args: any[]) => {
        this.checkCreateNode();
        const { mosaicActions } = this.context;
        const { createNode, path } = this.props;
        return Promise.resolve(createNode!(...args)).then((node) => mosaicActions.replaceWith(path, node));
    };

    private setAdditionalControlsOpen = (additionalControlsOpen: boolean) => {
        this.setState({ additionalControlsOpen });
    };

    private getPath = () => this.props.path;

    private connectDragSource = (connectedElements: ConnectableElement) => {
        const { connectDragSource } = this.props;
        return connectDragSource(connectedElements);
    };

    private readonly childContext: ModernMosaicWindowContext = {
        mosaicWindowActions: {
            split: this.split,
            replaceWithNew: this.swap,
            setAdditionalControlsOpen: this.setAdditionalControlsOpen,
            getPath: this.getPath,
            connectDragSource: this.connectDragSource
        }
    };
}

const dragSpec = {
    beginDrag: beginWidgetDrag<InternalMosaicWindowProps<any>>(({ defer, component }) => {
        defer(() => component.context.mosaicActions.hide(component.props.path));
        return {
            type: DragDataType.WINDOW,
            path: component.props.path
        };
    }),
    endDrag: endWidgetDrag<InternalMosaicWindowProps<any>>(dragDropService.handleDropEvent),
    canDrag: dragDropService.canDrag
};

// Each step exported here just to keep react-hot-loader happy
export const SourceConnectedInternalMosaicWindow = DragSource(MosaicDragType.WINDOW, dragSpec, collectDragProps)(
    InternalMosaicWindow
);

export class MosaicWindow<T extends MosaicKey = string> extends React.PureComponent<MosaicWindowProps<T>> {
    static ofType<T extends MosaicKey>() {
        return MosaicWindow as new (props: MosaicWindowProps<T>, context?: any) => MosaicWindow<T>;
    }

    render() {
        return <SourceConnectedInternalMosaicWindow {...(this.props as InternalMosaicWindowProps<T>)} />;
    }
}

/* tslint:disable:member-ordering */

import React from "react";
import classNames from "classnames";
import { countBy, keys, pickBy } from "lodash";

import { ModernMosaicContext, MosaicContext, MosaicRootActions } from "./contextTypes";
import { MosaicRoot } from "./MosaicRoot";
import { MosaicZeroState } from "./MosaicZeroState";
import { RootDropTargets } from "./RootDropTargets";
import { MosaicKey, MosaicNode, MosaicPath, MosaicUpdate, ResizeOptions, TileRenderer } from "./types";
import { createExpandUpdate, createHideUpdate, createRemoveUpdate, updateTree } from "./util/mosaicUpdates";
import { getLeaves } from "./util/mosaicUtilities";

import { MOSAIC_CONTEXT_ID } from "../../constants";

const DEFAULT_EXPAND_PERCENTAGE = 70;

export interface MosaicBaseProps<T extends MosaicKey> {
    /**
     * Lookup function to convert `T` to a displayable `JSX.Element`
     */
    renderTile: TileRenderer<T>;
    /**
     * Called when a user initiates any change to the tree (removing, adding, moving, resizing, etc.)
     */
    onChange?: (newNode: MosaicNode<T> | null) => void;
    /**
     * Called when a user completes a change (fires like above except for the interpolation during resizing)
     */
    onRelease?: (newNode: MosaicNode<T> | null) => void;
    /**
     * Additional classes to affix to the root element
     * Default: 'mosaic-blueprint-theme'
     */
    className?: string;
    /**
     * Options that control resizing
     * @see: [[ResizeOptions]]
     */
    resize?: ResizeOptions;
    /**
     * View to display when the current value is `null`
     * default: Simple NonIdealState view
     */
    zeroStateView?: JSX.Element;
}

export interface MosaicControlledProps<T extends MosaicKey> extends MosaicBaseProps<T> {
    /**
     * The tree to render
     */
    value: MosaicNode<T> | null;
    onChange: (newNode: MosaicNode<T> | null) => void;
}

export interface MosaicUncontrolledProps<T extends MosaicKey> extends MosaicBaseProps<T> {
    /**
     * The initial tree to render, can be modified by the user
     */
    initialValue: MosaicNode<T> | null;
}

export type MosaicProps<T extends MosaicKey> = MosaicControlledProps<T> | MosaicUncontrolledProps<T>;

function isUncontrolled<T extends MosaicKey>(props: MosaicProps<T>): props is MosaicUncontrolledProps<T> {
    return (props as MosaicUncontrolledProps<T>).initialValue != null;
}

export interface MosaicState<T extends MosaicKey> {
    currentNode: MosaicNode<T> | null;
    mosaicId: string;
}

export class MosaicWithoutDragDropContext<T extends MosaicKey = string> extends React.PureComponent<
    MosaicProps<T>,
    MosaicState<T>
> {
    static defaultProps = {
        onChange: () => void 0,
        zeroStateView: <MosaicZeroState />,
        className: "mosaic-blueprint-theme"
    };

    static childContextTypes = MosaicContext;

    static ofType<T extends MosaicKey>() {
        return MosaicWithoutDragDropContext as new (
            props: MosaicProps<T>,
            context?: any
        ) => MosaicWithoutDragDropContext<T>;
    }

    state: MosaicState<T> = {
        currentNode: null,
        mosaicId: MOSAIC_CONTEXT_ID
    };

    getChildContext(): MosaicContext<T> {
        return this.childContext;
    }

    render() {
        const { className } = this.props;

        return (
            <ModernMosaicContext.Provider value={this.childContext as MosaicContext<any>}>
                <div className={classNames(className, "mosaic mosaic-drop-target")}>{this.renderTree()}</div>
            </ModernMosaicContext.Provider>
        );
    }

    componentWillReceiveProps(nextProps: MosaicProps<T>) {
        if (
            isUncontrolled(nextProps) &&
            nextProps.initialValue !== (this.props as MosaicUncontrolledProps<T>).initialValue
        ) {
            this.setState({ currentNode: nextProps.initialValue });
        }
    }

    componentWillMount() {
        if (isUncontrolled(this.props)) {
            this.setState({ currentNode: this.props.initialValue });
        }
    }

    private getRoot(): MosaicNode<T> | null {
        if (isUncontrolled(this.props)) {
            return this.state.currentNode;
        } else {
            return this.props.value;
        }
    }

    private updateRoot = (updates: MosaicUpdate<T>[], suppressOnRelease: boolean = false) => {
        const currentNode = this.getRoot() || ({} as MosaicNode<T>);

        this.replaceRoot(updateTree(currentNode, updates), suppressOnRelease);
    };

    private replaceRoot = (currentNode: MosaicNode<T> | null, suppressOnRelease: boolean = false) => {
        this.props.onChange!(currentNode);
        if (!suppressOnRelease && this.props.onRelease) {
            this.props.onRelease(currentNode);
        }

        if (isUncontrolled(this.props)) {
            this.setState({ currentNode });
        }
    };

    private actions: MosaicRootActions<T> = {
        updateTree: this.updateRoot,
        remove: (path: MosaicPath) => {
            if (path.length === 0) {
                this.replaceRoot(null);
            } else {
                this.updateRoot([createRemoveUpdate(this.getRoot(), path)]);
            }
        },
        expand: (path: MosaicPath, percentage: number = DEFAULT_EXPAND_PERCENTAGE) =>
            this.updateRoot([createExpandUpdate<T>(path, percentage)]),
        getRoot: () => this.getRoot()!,
        hide: (path: MosaicPath) => this.updateRoot([createHideUpdate<T>(path)]),
        replaceWith: (path: MosaicPath, newNode: MosaicNode<T>) =>
            this.updateRoot([
                {
                    path,
                    spec: {
                        $set: newNode
                    }
                }
            ])
    };

    private readonly childContext: MosaicContext<T> = {
        mosaicActions: this.actions,
        mosaicId: this.state.mosaicId
    };

    private renderTree() {
        const root = this.getRoot();
        this.validateTree(root);
        if (root === null || root === undefined) {
            return this.props.zeroStateView!;
        } else {
            const { renderTile, resize } = this.props;
            return (
                <>
                    <MosaicRoot root={root} renderTile={renderTile} resize={resize} />,
                    <RootDropTargets />
                </>
            );
        }
    }

    private validateTree(node: MosaicNode<T> | null) {
        if (process.env.NODE_ENV !== "production") {
            const duplicates = keys(pickBy(countBy(getLeaves(node)), (n) => n > 1));

            if (duplicates.length > 0) {
                throw new Error(
                    `Duplicate IDs [${duplicates.join(", ")}] detected. Mosaic does not support leaves with the same ID`
                );
            }
        }
    }
}

// @(DragDropContext(HTML5) as ClassDecorator)
export class Mosaic<T extends MosaicKey = string> extends MosaicWithoutDragDropContext<T> {
    static ofType<T extends MosaicKey>() {
        return Mosaic as new (props: MosaicProps<T>, context?: any) => Mosaic<T>;
    }
}

// Factory that works with generics
export function MosaicFactory<T extends MosaicKey = string>(
    props: MosaicProps<T> & React.Attributes,
    ...children: React.ReactNode[]
) {
    const element: React.ReactElement<MosaicProps<T>> = React.createElement(
        Mosaic as React.ComponentClass<MosaicProps<T>>,
        props,
        ...children
    );
    return element;
}

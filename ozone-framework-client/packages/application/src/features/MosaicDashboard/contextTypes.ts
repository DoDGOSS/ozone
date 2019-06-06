import React from "react";
import PropTypes from "prop-types";
import { ConnectableElement } from "react-dnd";

import { MosaicKey, MosaicNode, MosaicPath, MosaicUpdate } from "./types";

/**
 * Mosaic provides functionality on the context for components within
 * Mosaic to affect the view state.
 */

/**
 * Context provided to everything within Mosaic
 */
export interface MosaicContext<T extends MosaicKey> {
    mosaicActions: MosaicRootActions<T>;
    mosaicId: string;
}

/**
 * Context provided to everything within a Mosaic Window
 */
export interface MosaicWindowContext<T extends MosaicKey> extends MosaicContext<T> {
    mosaicWindowActions: MosaicWindowActions;
}

/**
 * These actions are used to alter the state of the view tree
 */
export interface MosaicRootActions<T extends MosaicKey> {
    /**
     * Increases the size of this node and bubbles up the tree
     * @param path Path to node to expand
     * @param percentage Every node in the path up to root will be expanded to this percentage
     */
    expand: (path: MosaicPath, percentage?: number) => void;
    /**
     * Remove the node at `path`
     * @param path
     */
    remove: (path: MosaicPath) => void;
    /**
     * Hide the node at `path` but keep it in the DOM. Used in Drag and Drop
     * @param path
     */
    hide: (path: MosaicPath) => void;
    /**
     * Replace currentNode at `path` with `node`
     * @param path
     * @param node
     */
    replaceWith: (path: MosaicPath, node: MosaicNode<T>) => void;
    /**
     * Atomically applies all updates to the current tree
     * @param updates
     * @param suppressOnRelease (default: false)
     */
    updateTree: (updates: MosaicUpdate<T>[], suppressOnRelease?: boolean) => void;
    /**
     * Returns the root of this Mosaic instance
     */
    getRoot: () => MosaicNode<T> | null;
}

export interface MosaicWindowActions {
    /**
     * Fails if no `createNode()` is defined
     * Creates a new node and splits the current node.
     * The current node becomes the `first` and the new node the `second` of the result.
     * `direction` is chosen by querying the DOM and splitting along the longer axis
     */
    split: (...args: any[]) => Promise<void>;
    /**
     * Fails if no `createNode()` is defined
     * Convenience function to call `createNode()` and replace the current node with it.
     */
    replaceWithNew: (...args: any[]) => Promise<void>;
    /**
     * Sets the open state for the tray that holds additional controls
     */
    setAdditionalControlsOpen: (open: boolean) => void;
    /**
     * Returns the path to this window
     */
    getPath: () => MosaicPath;
    /**
     * Enables connecting a different drag source besides the react-mosaic toolbar
     */
    connectDragSource: (connectedElements: ConnectableElement) => React.ReactElement<any> | null;
}

/*************************************************************
 * PropTypes for React `contextTypes`
 */

export const MosaicActionsPropType = PropTypes.shape({
    expand: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    replaceWith: PropTypes.func.isRequired,
    updateTree: PropTypes.func.isRequired,
    getRoot: PropTypes.func.isRequired
}).isRequired;

export const MosaicWindowActionsPropType = PropTypes.shape({
    split: PropTypes.func.isRequired,
    replaceWithNew: PropTypes.func.isRequired,
    setAdditionalControlsOpen: PropTypes.func.isRequired,
    getPath: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired
}).isRequired;

/*************************************************************
 * Bundled PropTypes for convenience
 */

export const MosaicContext = {
    mosaicActions: MosaicActionsPropType,
    mosaicId: PropTypes.string.isRequired
};

export const MosaicWindowContext = {
    ...MosaicContext,
    mosaicWindowActions: MosaicWindowActionsPropType
};

/*************************************************************
 * Modern context
 */

export const ModernMosaicContext = React.createContext<MosaicContext<MosaicKey>>(undefined!);

export type ModernMosaicWindowContext = Pick<MosaicWindowContext<MosaicKey>, "mosaicWindowActions">;
export const ModernMosaicWindowContext = React.createContext<ModernMosaicWindowContext>(undefined!);

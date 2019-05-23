import React from "react";
import {
    MosaicBranch,
    MosaicNode,
    MosaicParent,
    MosaicWindow,
    MosaicWithoutDragDropContext
} from "../../features/MosaicDashboard";

export const DashboardLayout = MosaicWithoutDragDropContext.ofType<string>();

export const DashboardWindow = MosaicWindow.ofType<string>();

export type DashboardParent = MosaicParent<string>;

export type DashboardNode = MosaicNode<string>;

export type DashboardPath = MosaicBranch[];

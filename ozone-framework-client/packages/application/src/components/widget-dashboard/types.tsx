import React from "react";
import { MosaicWindow } from "../../features/MosaicDashboard/MosaicWindow";
import { MosaicBranch, MosaicNode, MosaicParent } from "../../features/MosaicDashboard/types";
import { MosaicWithoutDragDropContext } from "../../features/MosaicDashboard/Mosaic";

export const DashboardLayout = MosaicWithoutDragDropContext.ofType<string>();

export const DashboardWindow = MosaicWindow.ofType<string>();

export type DashboardParent = MosaicParent<string>;

export type DashboardNode = MosaicNode<string>;

export type DashboardPath = MosaicBranch[];

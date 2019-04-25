import React from "react";

import { Mosaic, MosaicBranch, MosaicNode, MosaicParent, MosaicWindow } from "react-mosaic-component";

export const DashboardLayout = Mosaic.ofType<string>();

export const DashboardWindow = MosaicWindow.ofType<string>();

export type DashboardParent = MosaicParent<string>;

export type DashboardNode = MosaicNode<string>;

export type DashboardPath = MosaicBranch[];

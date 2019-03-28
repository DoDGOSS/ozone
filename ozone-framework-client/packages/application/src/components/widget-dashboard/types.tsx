import React from "react";

import { Mosaic, MosaicBranch, MosaicNode, MosaicParent, MosaicWindow } from "react-mosaic-component";
import { Panel } from "./model/types";

export const DashboardLayout = Mosaic.ofType<string>();

export const DashboardWindow = MosaicWindow.ofType<string>();

export type DashboardParent = MosaicParent<string>;

export type DashboardNode = MosaicNode<string>;

export type DashboardPath = MosaicBranch[];

export type PanelMap = { [id: string]: Panel<any> };

import { action, computed, observable, runInAction, when } from "mobx";
import { injectable } from "../inject";

import { MosaicNode } from 'react-mosaic-component';

// switch to FIT_DEFAULT for testing
import { LOGIN_DASHBOARD } from "./DefaultDashboard";

import { MainStore } from "./MainStore";
import { lazyInject } from "../inject";

import { Corner,
        getNodeAtPath,
        getOtherDirection,
        getPathToCorner,
        MosaicDirection,
        MosaicParent,
        updateTree } from 'react-mosaic-component';
import dropRight from 'lodash/dropRight';

export interface WidgetDefinition {
    id: string;
    title: string;
    element: JSX.Element;
}

export interface Widget {
    id: string;
    definition: WidgetDefinition;
}

export type DashboardNode = MosaicNode<string>;

export type WidgetMap = { [id: string]: Widget };

export interface Dashboard {
    layout: DashboardNode | null;
    widgets: WidgetMap;
}

@injectable()
export class DashboardStore {
    @observable
    dashboard: Dashboard | undefined;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @computed
    get layout(): DashboardNode | null {
        return this.dashboard ? this.dashboard.layout : null;
    }

    @computed
    get widgets(): WidgetMap | null {
        return this.dashboard ? this.dashboard.widgets : null;
    }

    constructor() {
        runInAction("initialize", () => {
          if (!this.dashboard){
            //swithch to FIT_DEFAULT for testing
            this.dashboard = LOGIN_DASHBOARD;
          }
        });
    }

    @action.bound
    setDashboard(dashboard: Dashboard | undefined) {
        this.dashboard = dashboard;
    }

    @action.bound
    getDashboard() {
        if (!this.dashboard){
          //swithch to FIT_DEFAULT for testing
          return LOGIN_DASHBOARD;
        }
        else{
          return this.dashboard;
        }
    }

    @action.bound
    setLayout(dashboardNode: DashboardNode | null) {
        if (!this.dashboard) return;
        this.dashboard.layout = dashboardNode;
    }

    @action.bound
    addToTopRight(dashboard:Dashboard, widget:string, windowCount:number) {
    if(this.getDashboard().widgets.hasOwnProperty('fit-flag')) {
      // if widget already exists
      if(this.getDashboard().layout!==null){
        this.mainStore.showConfirmationDialog();
        when(
          () => !this.mainStore.isConfirmationDialogVisible,
            ()=> {
                if (this.mainStore.isConfirmationTrue) {
                    let { layout } = dashboard;
                    this.setDashboard(dashboard);
                    layout = widget;
                    dashboard.layout = layout;
                    this.setLayout(dashboard.layout);
                }
            }
        )
      }else{
        let { layout } = dashboard;
        this.setDashboard(dashboard);
        layout = widget;
        dashboard.layout = layout;
        this.setLayout(dashboard.layout);
      }
    }
    else{
      let { layout } = dashboard;
      this.setDashboard(dashboard);
      if (layout) {
        const path = getPathToCorner(layout, Corner.TOP_RIGHT);
        const parent = getNodeAtPath(layout, dropRight(path)) as MosaicParent<string>;
        const destination = getNodeAtPath(layout, path) as MosaicNode<string>;
        const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : 'row';
        let first: MosaicNode<string>;
        let second: MosaicNode<string>;
        if (direction === 'row') {
          first = destination;
          second = String(windowCount);
        } else {
          first = String(windowCount);
          second = destination;
        }
        layout = updateTree(layout, [
          {
            path,
            spec: {
              $set: {
                direction,
                first,
                second,
              },
            },
          },
        ]);
      } else {
        layout = widget;
      }
      dashboard.layout = layout;
      this.setLayout(dashboard.layout);
      }
    }

}

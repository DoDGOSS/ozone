import React from "react";
import { ITreeNode, Tree } from "@blueprintjs/core";

import { dashboardStore } from "../../stores/DashboardStore";
import { mainStore } from "../../stores/MainStore";

import { showToast } from "../../components/toaster/Toaster";

interface Props {
    nodes: ITreeNode[];
}

export interface State {
    nodes: ITreeNode[];
}

// use Component so it re-renders everytime: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
export class GenericTree extends React.Component<State, Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nodes: props.nodes
        };
    }

    render() {
        return (
            <Tree
                contents={this.state.nodes}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
                onNodeClick={this.handleNodeClick}
            />
        );
    }

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    private handleNodeClick = async (nodeData: ITreeNode): Promise<any> => {
        if (nodeData.id === undefined || String(nodeData.id).startsWith("_NoDash_")) {
            showToast({
                message: "Can't open an empty stack - add a dashboard to it first."
            });
            return new Promise(() => {
                return;
            });
        }
        const response = await dashboardStore.fetchUserDashboards(nodeData.id);
        mainStore.hideStackDialog();
    };
}

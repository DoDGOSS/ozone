import React from "react";
import { Classes, Icon, Intent, ITreeNode, Position, Tooltip, Tree } from "@blueprintjs/core";

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
                onNodeDoubleClick={this.handleNodeDoubleClick}
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

    private handleNodeDoubleClick = (nodeData: ITreeNode) => {
        console.log("CODE HERE TO OPEN STACK OR DASHBOARD FOR: " + nodeData.label);
    };
}

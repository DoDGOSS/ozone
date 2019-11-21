import React from "react";
import { ITreeNode, Tree } from "@blueprintjs/core";

import { backendUrl } from "../../environment";

interface Props {
    nodes: ITreeNode[];
}

export interface State {
    nodes: ITreeNode[] | undefined;
}

// use Component so it re-renders every time: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
export class HelpTree extends React.Component<State, Props> {
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
        if (nodeData.icon === "document") {
            const fullUrl = backendUrl() + "/" + nodeData.id;
            window.open(fullUrl.replace("api/v2/", ""));
        }
    };
}

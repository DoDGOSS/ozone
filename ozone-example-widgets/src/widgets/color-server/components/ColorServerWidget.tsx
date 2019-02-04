import "./ColorServerWidget.scss";

import React, { Component } from "react";

import { SectionHeader } from "../../../common/SectionHeader";


interface ColorResult {
    colors: string[];
    selected: string;
}


interface WidgetState {
    color: string;
}

export class ColorServerWidget extends Component<{}, WidgetState> {

    constructor(props: any) {
        super(props);

        this.state = {
            color: "white"
        };
    }

    getColors(): ColorResult {
        return {
            colors: [
                "white",
                "red",
                "blue",
                "yellow"
            ],
            selected: this.state.color
        };
    }

    setColor(color: string): boolean {
        this.setState({ color });
        return true;
    }

    componentDidMount(): void {
        OWF.RPC.registerFunctions([
            { name: "getColors", fn: this.getColors.bind(this) },
            { name: "setColor", fn: this.setColor.bind(this) }
        ]);
    }

    render() {
        return (
            <div className="app flex-column">
                <SectionHeader text="Color Server Status"/>

                <div className="color-box flex-grow"
                     style={{ backgroundColor: this.state.color }}/>
            </div>
        );
    }

}

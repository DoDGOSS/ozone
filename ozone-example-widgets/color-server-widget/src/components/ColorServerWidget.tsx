import "./ColorServerWidget.scss";

import React, { Component } from "react";

import { Navbar } from "@blueprintjs/core";


interface AppState {
    color: string;
}

interface ColorResult {
    colors: string[];
    selected: string;
}

class ColorServerWidget extends Component<{}, AppState> {

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
                <Navbar className="section-header bp3-dark">
                    <Navbar.Group>
                        <Navbar.Heading>Color Server Status</Navbar.Heading>
                    </Navbar.Group>
                </Navbar>
                <div className="color-box flex-grow"
                     style={{ backgroundColor: this.state.color }}/>
            </div>
        );
    }

}

export default ColorServerWidget;

import "./ColorClientWidget.scss";

import React, { Component } from "react";

import { Button, FormGroup, HTMLSelect, Intent, Navbar, Position, Toaster } from "@blueprintjs/core";

import { getColorServerProxy } from "../api/color-server";
import { isNil } from "../util";


interface WidgetState {
    colors?: string[];
    selected?: string;
}

export class ColorClientWidget extends Component<{}, WidgetState> {

    constructor(props: any) {
        super(props);

        this.state = {};

        this.onColorSelected = this.onColorSelected.bind(this);
        this.fetchColors = this.fetchColors.bind(this);
    }

    render() {
        const { colors, selected } = this.state;

        return (
            <div className="app flex-column">

                <Navbar className="section-header bp3-dark">
                    <Navbar.Group>
                        <Navbar.Heading>Color Client Controls</Navbar.Heading>
                    </Navbar.Group>
                </Navbar>

                <FormGroup label="Color Selection">
                    <HTMLSelect disabled={isNil(colors)}
                                value={selected}
                                fill={true}
                                onChange={this.onColorSelected}>
                        {!isNil(colors) && colors.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </HTMLSelect>
                </FormGroup>

                <Button text="Get Colors"
                        icon="refresh"
                        onClick={this.fetchColors}/>
            </div>
        );
    }

    private async fetchColors() {
        try {
            const proxy = await getColorServerProxy();

            proxy.getColors((result) => {
                // TODO: Error handling
                this.setState({
                    colors: result.colors,
                    selected: result.selected
                });
            });
        } catch (ex) {
            this.clearColors();
            reportError(ex);
        }
    }

    private onColorSelected(event: React.FormEvent<HTMLSelectElement>) {
        this.setSelectedColor(event.currentTarget.value);
    }

    private async setSelectedColor(color: string) {
        try {
            const proxy = await getColorServerProxy();
            proxy.setColor(color);
            this.setState({ selected: color });
        } catch (ex) {
            this.clearColors();
            reportError(ex);
        }
    }

    private clearColors() {
        this.setState({
            colors: undefined,
            selected: undefined
        });
    }

}


const AppToaster = Toaster.create({
    position: Position.BOTTOM,
});

function reportError(error: Error) {
    AppToaster.show({ intent: Intent.WARNING, message: error.message });
    console.error(error);
}



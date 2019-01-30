import "./WidgetSearchWidget.scss";

import React, { Component } from "react";

import { Button, FormGroup, InputGroup, Intent, Position, Toaster } from "@blueprintjs/core";

import ReactDataGrid from "react-data-grid";

import { SectionHeader } from "./SectionHeader";


interface WidgetRow {
    id: string;
    name: string;
}

const COLUMNS = [
    {
        key: "name",
        name: "Name",
        resizable: true
    },
    {
        key: "id",
        name: "ID",
        resizable: true,
        width: 250
    }
];


interface WidgetState {
    query: string;
    results: WidgetRow[];
}

export class WidgetSearchWidget extends Component<{}, WidgetState> {

    constructor(props: any) {
        super(props);

        this.state = {
            query: "",
            results: []
        };

        this.onQueryChanged = this.onQueryChanged.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.search();
    }

    render() {
        return (
            <div className="app flex-column">
                <div>
                    <SectionHeader text="Search"/>

                    <form onSubmit={(event) => {
                        event.preventDefault();
                        this.search();
                    }}>
                        <FormGroup inline={true}
                                   label="Widget Name">
                            <InputGroup value={this.state.query}
                                        onChange={this.onQueryChanged}
                                        spellCheck={false}
                                        rightElement={
                                            <Button icon="search"
                                                    minimal={true}
                                                    onClick={this.search}/>
                                        }
                            />
                        </FormGroup>
                    </form>
                </div>

                <div className="search-results">
                    <SectionHeader text="Results"/>

                    <ReactDataGrid
                        columns={COLUMNS}
                        rowGetter={i => this.state.results[i]}
                        rowsCount={this.state.results.length}
                        minHeight={300}
                    />
                </div>
            </div>
        );
    }

    onQueryChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            query: event.currentTarget.value
        });
    }

    search() {
        Ozone.pref.PrefServer.findWidgets({
            searchParams: {
                widgetName: this.state.query
            },
            onSuccess: (dtos: Ozone.WidgetDTO[]) => {
                const results = dtos.map(dto => ({
                    id: dto.id,
                    name: dto.value.namespace
                }));

                this.setState({ results });
            },
            onFailure: (error: any) => {
                reportError(error);
            }
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

import "./WidgetSearchWidget.scss";

import React, { useCallback, useEffect, useState } from "react";

import { Button, FormGroup, InputGroup, Intent, Position, Toaster } from "@blueprintjs/core";

import { SectionHeader } from "../../../common/SectionHeader";

import { WidgetRow, WidgetTable } from "./WidgetTable";
import { handleStringChange } from "../../../util";


export const WidgetSearchWidget: React.FC<{}> = () => {
    const [ query, setQuery ] = useState("");
    const [ widgets, setWidgets ] = useState<WidgetRow[]>([]);

    const search = useCallback(() => {
        Ozone.pref.PrefServer.findWidgets({
            searchParams: {
                widgetName: query
            },
            onSuccess: (dtos: Ozone.WidgetDTO[]) => {
                const results = dtos.map((dto) => ({
                    id: dto.id,
                    name: dto.value.namespace
                }));
                setWidgets(results);
            },
            onFailure: (error: any) => {
                reportError(error);
            }
        });
    }, []);

    useEffect(() => {
        OWF.notifyWidgetReady();
        search();
    }, []);

    return (
        <div className="app flex-column">
            <div>
                <SectionHeader text="Search"/>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        search();
                    }}
                >
                    <FormGroup inline={true} label="Widget Name">
                        <InputGroup
                            value={query}
                            onChange={handleStringChange(setQuery)}
                            spellCheck={false}
                            rightElement={<Button icon="search" minimal={true} onClick={search}/>}
                        />
                    </FormGroup>
                </form>
            </div>

            <div className="search-results">
                <SectionHeader text="Results"/>
                <WidgetTable widgets={widgets}/>
            </div>
        </div>
    );
};

const AppToaster = Toaster.create({
    position: Position.BOTTOM
});

function reportError(error: Error) {
    AppToaster.show({ intent: Intent.WARNING, message: error.message });
    console.error(error);
}

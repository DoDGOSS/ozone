import React, { useCallback } from "react";

import { Button, Intent } from "@blueprintjs/core";

import ReactDataGrid, { Column } from "react-data-grid";

export interface WidgetRow {
    id: string;
    name: string;
}

const WidgetRowActions: React.FC<{ row: WidgetRow }> = ({ row }) => {
    const launchWidget = useCallback(() => {
        OWF.Launcher.launch({
            guid: row.id,
            title: `${row.name} (Launched)`,
            data: JSON.stringify({example: "example launch data"})
        });
    }, [ row ]);

    return (
        <Button minimal={true}
                text="Launch"
                icon="add"
                intent={Intent.PRIMARY}
                onClick={launchWidget}/>
    );
};

const COLUMNS: Column<any>[] = [
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
    },
    {
        key: "actions",
        name: "Actions",
        resizable: true,
        width: 250,
        formatter: WidgetRowActions
    }
];

export let WidgetTable: React.FC<{ widgets: WidgetRow[] }> = ({ widgets }) => (
    <ReactDataGrid
        columns={COLUMNS}
        rowGetter={(i) => widgets[i]}
        rowsCount={widgets.length}
        minHeight={300}/>
);

WidgetTable = React.memo(WidgetTable);

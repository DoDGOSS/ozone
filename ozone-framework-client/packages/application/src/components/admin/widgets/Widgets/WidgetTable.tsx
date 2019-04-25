import * as styles from "../Widgets.scss";

import * as React from "react";
import { useMemo } from "react";

import { Button, ButtonGroup, Intent } from "@blueprintjs/core";

import { Column, TableCellRenderer } from "react-table";

import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { GenericTable } from "../../table/GenericTable";

export interface WidgetCellActions {
    onDelete: (widget: WidgetDTO) => void;
}

export interface WidgetTableProps extends WidgetCellActions {
    data: WidgetDTO[];
    isLoading: boolean;
    defaultPageSize: number;
}

export const WidgetTable: React.FC<WidgetTableProps> = (props) => {
    const { data, isLoading, onDelete, defaultPageSize } = props;

    const columns = useMemo(
        () =>
            [
                {
                    Header: "Widgets",
                    columns: [
                        { Header: "Title", id: "title", accessor: (widget) => widget.value.namespace },
                        { Header: "URL", id: "url", accessor: (widget) => widget.value.url },
                        { Header: "Users", id: "users", accessor: (widget) => widget.value.totalUsers },
                        { Header: "Groups", id: "groups", accessor: (widget) => widget.value.totalGroups },
                        { Cell: WidgetCellRenderer({ onDelete }) }
                    ]
                }
            ] as Column<WidgetDTO>[],
        [onDelete]
    );

    return (
        <GenericTable
            items={data}
            getColumns={() => columns}
            reactTableProps={{
                loading: isLoading,
                defaultPageSize
            }}
        />
    );
};

function WidgetCellRenderer(actions: WidgetCellActions): TableCellRenderer {
    return (row: { original: WidgetDTO }) => (
        <div>
            <ButtonGroup>
                <Button
                    data-element-id="delete-widget-button"
                    data-widget-title={row.original.value.namespace}
                    text="Delete"
                    intent={Intent.DANGER}
                    icon="trash"
                    small={true}
                    onClick={() => actions.onDelete(row.original)}
                />
            </ButtonGroup>
        </div>
    );
}

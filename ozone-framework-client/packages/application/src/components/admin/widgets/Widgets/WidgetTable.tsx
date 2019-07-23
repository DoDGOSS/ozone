import * as React from "react";
import { useMemo } from "react";

import { ButtonGroup } from "@blueprintjs/core";

import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";

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
                { title: "Title", field: "value.namespace" },
                { title: "URL", field: "value.url" },
                { title: "Users", field: "value.totalUsers" },
                { title: "Groups", field: "value.totalGroups" },
                { title: "Actions", width: 90, responsive: 0, formatter: WidgetCellRenderer({ onDelete }) }
            ] as ColumnTabulator[],
        [onDelete]
    );

    return (
        <GenericTable
            items={data}
            getColumns={() => columns}
            tableProps={{
                loading: isLoading,
                paginationSize: defaultPageSize
            }}
        />
    );
};

function WidgetCellRenderer(actions: WidgetCellActions) {
    return (row: any) => {
        const data: WidgetDTO = row.cell._cell.row.data;
        return (
            <ButtonGroup>
                <DeleteButton onClick={() => actions.onDelete(data)} itemName={data.value.namespace} />
            </ButtonGroup>
        );
    };
}

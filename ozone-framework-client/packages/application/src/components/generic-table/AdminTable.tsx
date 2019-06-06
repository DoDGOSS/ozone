import * as React from "react";

import { mainStore } from "../../stores/MainStore";
import { classNames, isFunction } from "../../utility";

import "react-tabulator/lib/styles.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap4.min.css";

// @ts-ignore
import { reactFormatter, ReactTabulator } from "react-tabulator";
import { ColumnTabulator } from "./GenericTable";

export type AdminTableProps = {
    data: any[];
    columns?: ColumnTabulator<any>[];
    loading: boolean;
    pageSize?: number;
    getTrProps?: (state: any, rowInfo: any) => {};
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 25, 50, 100];

// Todo
// Please just use GenericTable.

// Add filter functionality - https://codesandbox.io/s/r74mokr5x4 (react-table-filter implementation)
// https://react-table.js.org/#/story/custom-filtering

// Make responsive - may not be easily done with this release
// try new wrapped tabulator if necessary https://github.com/ngduc/react-tabulator#readme

export class AdminTable extends React.Component<AdminTableProps, {}> {
    render() {
        return (
            <ReactTabulator
                columns={this.formatColumnNames(this.props.columns)}
                data={this.props.data}
                options={this.buildTableProps()}
                // data-custom-attr="test-custom-attribute"
                className={classNames("table-sm table-striped table-borderless", mainStore.getTheme())}
            />
        );
    }

    private buildTableProps(): Object {
        return {
            height: "100%",
            layout: "fitDataFill",
            layoutColumnsOnNewData: true,
            responsiveLayout: "collapse",
            pagination: "local",
            paginationSize: this.props.pageSize,
            paginationSizeSelector: PAGE_SIZE_OPTIONS,
            placeholder: "No Data Available",
            selectable: "highlight",
            autoResize: true
        };
    }

    /**
     * Format the column to add reactFormatter from Tabulator.
     * Also, add common params like sorting and align to action field.
     * @param columns
     */
    private formatColumnNames(columns: ColumnTabulator[] | undefined): ColumnTabulator[] {
        if (columns === undefined) {
            return [];
        }

        const tabulator = columns.map((col: ColumnTabulator) => {
            // if formatter is not a built-in tabulator module, i.e string. tickCross, color etc.
            if (col.hasOwnProperty("formatter") && isFunction(col.formatter)) {
                col.formatter = reactFormatter(<col.formatter />);
            }
            if (col.hasOwnProperty("title") && col.title.toLowerCase() === "actions") {
                col.headerSort = false;
            }
            return col;
        });

        // freeze first column in place during horizontal scroll.
        // tabulator[0].frozen = true;
        return tabulator;
    }
}

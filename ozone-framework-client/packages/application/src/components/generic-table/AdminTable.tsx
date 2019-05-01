import * as React from "react";

import ReactTable, { Column } from "react-table";
import "react-table/react-table.css";
import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";

export type AdminTableProps = {
    data: any[];
    columns?: Column<any>[];
    loading: boolean;
    pageSize?: number;
    getTrProps?: (state: any, rowInfo: any) => {};
};

// Todo

// Add filter functionality - https://codesandbox.io/s/r74mokr5x4 (react-table-filter implementation)
// https://react-table.js.org/#/story/custom-filtering

// Make responsive - may not be easily done with this release
// try new wrapped tabulator if necessary https://github.com/ngduc/react-tabulator#readme

export class AdminTable extends React.Component<AdminTableProps, {}> {
    render() {
        return (
            <ReactTable
                data={this.props.data}
                columns={this.props.columns}
                className={classNames("-striped -highlight", mainStore.getTheme())}
                loading={this.props.loading}
                pageSize={this.props.pageSize}
                getTrProps={this.props.getTrProps}
            />
        );
    }
}

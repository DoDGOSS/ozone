import * as React from "react";

import ReactTable, { Column } from "react-table";
import "react-table/react-table.css";

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
        {
            console.log('react table data: ')
            console.log(this.props.data)
        }
        return (
            <ReactTable
                data={this.props.data}
                columns={this.props.columns}
                className="-striped -highlight"
                loading={this.props.loading}
                pageSize={this.props.pageSize}
                getTrProps={this.props.getTrProps}
            />
        );
    }
}

import * as React from "react";

import { mainStore } from "../../stores/MainStore";
import { classNames, isFunction } from "../../utility";

import "react-tabulator/lib/styles.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap4.min.css";
// @ts-ignore
import { reactFormatter, ReactTabulator } from "react-tabulator";
import { ColumnTabulator, DEFAULT_TABLE_OPTIONS, isChrome } from "./GenericTable";
import { ResizeObserver } from "resize-observer";

export type AdminTableProps = {
    data: any[];
    columns?: ColumnTabulator<any>[];
    loading: boolean;
    pageSize?: number;
    getTrProps?: (state: any, rowInfo: any) => {};
};

// Todo
// Add filter functionality - https://codesandbox.io/s/r74mokr5x4 (react-table-filter implementation)
// https://react-table.js.org/#/story/custom-filtering

export class AdminTable extends React.Component<AdminTableProps, {}> {
    ro = new ResizeObserver(() => this.tableRedraw(true));
    tableRef: any;

    constructor(props: AdminTableProps) {
        super(props);
        this.tableRef = React.createRef();
    }

    componentDidMount(): void {
        if (!isChrome) {
            this.tableRedraw(true);
        }
    }

    componentDidUpdate(): void {
        if (!isChrome) {
            this.tableRedraw(true);

            if (this.getElementsByClassName(document.body, "mosaic-window").length > 0) {
                this.ro.observe(this.getElementsByClassName(document.body, "mosaic-window")[0]);
            }
        }
    }

    componentWillUnmount(): void {
        if (!isChrome) {
            this.ro.disconnect();
        }
    }

    render() {
        return (
            <ReactTabulator
                ref={this.tableRef}
                columns={this.formatColumnNames(this.props.columns)}
                data={this.props.data || []}
                options={this.buildTableProps()}
                // data-custom-attr="test-custom-attribute"
                className={classNames("table-sm table-striped table-borderless", mainStore.getTheme())}
            />
        );
    }

    private buildTableProps(): Object {
        const options = DEFAULT_TABLE_OPTIONS;
        if (!isChrome) {
            delete options.height;
        }
        return options;
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

        return columns.map((col: ColumnTabulator) => {
            // if formatter is not a built-in tabular module, i.e string. tickCross, color etc.
            if (col.hasOwnProperty("formatter") && isFunction(col.formatter)) {
                col.formatter = reactFormatter(<col.formatter />);
            }

            if (col.hasOwnProperty("title") && col.title.toLowerCase() === "actions") {
                col.headerSort = false;
                col.responsive = 0;
            }
            return col;
        });
    }

    private tableRedraw(dataReLoad = false) {
        if (!isChrome && this.tableRef.current) {
            this.tableRef.current.table.redraw(dataReLoad);
        }
    }

    /**
     * Get element by class name.
     * Compatible with all browsers.
     *
     * @param root
     * @param clss
     */
    private getElementsByClassName(root: any, clss: any) {
        let result: any = [];
        let els: any = [];
        let i: any = [];

        if (arguments.length < 2 || !root || !clss || root.nodeType !== 1) {
            return result;
        }

        clss = clss + "";

        if (root.getElementsByClassName) {
            result = root.getElementsByClassName(clss);
        } else if (root.querySelectorAll) {
            result = root.querySelectorAll("." + clss);
        } else {
            els = root.getElementsByTagName("*");
            clss = " " + clss + " ";
            for (i = 0; i < els.length; ++i) {
                if ((" " + els[i].className + " ").indexOf(clss) !== -1) {
                    result.push(els[i]);
                }
            }
        }
        return result;
    }
}

import React from "react";
// import Measure from "react-measure";
import { InputGroup } from "@blueprintjs/core";

// @ts-ignore
import { reactFormatter, ReactTabulator } from "react-tabulator";

import * as styles from "./GenericTable.scss";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap4.min.css";

import { classNames, isFunction, uuid } from "../../utility";
import { mainStore } from "../../stores/MainStore";

interface Props<T> {
    getColumns: () => ColumnTabulator[];
    items: T[];
    title?: string;
    onSelect?: (newItem: T) => void;
    onSelectionChange?: (newItems: T[]) => void;
    multiSelection?: boolean;
    customFilter?: (items: T[], query: string, queryMatches: (msg: string, query: string) => boolean) => T[];
    filterable?: boolean;
    tableProps?: any;
    classNames?: any;
    searchCaseSensitive?: boolean;
}

interface State<T> {
    selections: T[];
    selectionsAsRows: T[];
    query: string;
    dimensions: { width: number; height: number };
}

export interface ColumnTabulator<D = any> {
    title: string;
    field?: string;
    width?: string | number;
    minWidth?: number;
    widthGrow?: number;
    widthShrink?: number;
    align?: "left" | "right" | "center";
    sorter?: string;
    editor?: boolean;
    visible?: boolean;
    formatter?: any;
    cellClick?: any;
    headerFilter?: string;
    headerFilterParams?: Object;
    headerSort?: boolean;
    resizable?: boolean;
    frozen?: boolean;
    responsive?: number;
}

const DEFAULT_PAGE_SIZE = 6;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 25, 50, 100];
export const DEFAULT_TABLE_OPTIONS = {
    height: 300,
    layout: "fitColumns",
    layoutColumnsOnNewData: true,
    responsiveLayout: "collapse",
    pagination: "local",
    paginationSize: DEFAULT_PAGE_SIZE,
    paginationSizeSelector: PAGE_SIZE_OPTIONS,
    placeholder: "No Records Available",
    selectable: "highlight",
    autoResize: true,
    columnMinWidth: 120
};

export class GenericTable<T> extends React.Component<Props<T>, State<T>> {
    filterable: boolean;
    searchCaseSensitive: boolean;
    tableRef: any;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            selections: [],
            selectionsAsRows: [],
            query: "",
            dimensions: {
                width: -1,
                height: -1
            }
        };
        this.filterable = !(props.filterable === false);
        this.searchCaseSensitive = props.searchCaseSensitive ? props.searchCaseSensitive : false;
        this.tableRef = React.createRef();
    }

    render() {
        return (
            // <Measure
            //     bounds
            //     onResize={(contentRect) => {
            //         if (contentRect.bounds && this.state.dimensions.width !== contentRect.bounds.width) {
            //             this.setState({ dimensions: contentRect.bounds });
            //         }
            //     }}
            // >
            //     {({ measureRef }) => (
            //         <div ref={measureRef}>
                      <div>
                        {this.filterable && this.getSearchBox()}
                        <div className={styles.table}>
                            <ReactTabulator
                                ref={this.tableRef}
                                columns={this.formatColumnNames(this.props.getColumns())}
                                data={this.getItems()}
                                rowClick={(ev: any, row: any) => this.selectItem(ev, row)}
                                rowFormatter={(ev: any, row: any) => this.rowFormatItem(ev, row)}
                                options={this.buildTableProps(this.state.dimensions.height)}
                                // data-custom-attr="test-custom-attribute"
                                className={classNames("table-sm table-striped table-borderless", mainStore.getTheme())}
                            />
                        </div>
                    </div>
                // )}
            // </Measure>
        );
    }

    private buildTableProps(containerHeight?: number): Object {
        const options = DEFAULT_TABLE_OPTIONS;

        if (containerHeight) {
            options.height = Math.floor(containerHeight * 0.6);
        }
        return this.props.tableProps ? { ...options, ...this.props.tableProps } : options;
    }

    private rowFormatItem(ev: any, row: any): any {
        if (ev._row.data.hasOwnProperty("status") && ev._row.data.status === "inactive") {
            return (ev.getElement().style.color = "#9B9B9B");
        }
    }

    /**
     * Format the column to add reactFormatter from Tabulator.
     * Also, add common params like sorting and align to action field.
     * @param columns
     */
    private formatColumnNames(columns: ColumnTabulator[]): ColumnTabulator[] {
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

    private getItems(): any[] {
        if (this.props.customFilter && isFunction(this.props.customFilter)) {
            return this.props.customFilter(this.props.items, this.state.query, this.queryMatches);
        } else {
            return this.filter(this.props.items, this.state.query);
        }
    }

    private filter(items: T[], query: string): T[] {
        if (query === "") {
            return items;
        }
        return items.filter((item) => this.someColumnOfItemContainsQuery(item, query));
    }

    /** TODO - could improve this - this may be slow if there are many items.
     * Minimally make it wait for user to hit enter before filtering.
     * Pagination handling? Always return to the front seems like the simplest (fro the user's perspective) option.
     * Could like, record the current page's objects, and if any of them survive the filter, navigate to the page with the first of those objects.
     */
    private someColumnOfItemContainsQuery(item: T, query: string): boolean {
        return this.checkColumnsRecursively(item, query, this.props.getColumns());
    }

    // see https://stackoverflow.com/a/40350534/3015812 for !
    // TS compiler says `col` and `containerColumn` may be undefined, when they really can't be.
    // If there are no results for a filter, the corresponding loop won't happen.
    // The only danger below is if someone creates a `columns` field and fills it not to spec, but that would
    // break anything.
    private checkColumnsRecursively(item: T, query: string, columns: ColumnTabulator[]): boolean {
        for (const col of columns) {
            if (this.columnAccessorMatchesQuery(item, query, col)) {
                return true;
            }
        }
        return false;
    }

    private columnAccessorMatchesQuery(item: T, query: string, column: ColumnTabulator) {
        if (column.hasOwnProperty("field") && column.field) {
            const valueInColumnForItem: any = this.getAttributeUsingStringAccessor(item, column.field);
            let safeValueInColumn = "";
            if (valueInColumnForItem !== undefined && valueInColumnForItem !== null) {
                safeValueInColumn = valueInColumnForItem.toString();
            }
            // if neither function nor string, then the queryMatch will simply be given an empty string, and fail smoothly.
            if (this.queryMatches(safeValueInColumn, query)) {
                return true;
            }
        }
        return false;
    }

    private queryMatches = (text: string, query: string): boolean => {
        if (this.searchCaseSensitive) {
            return text.includes(query);
        } else {
            return text.toLowerCase().includes(query.toLowerCase());
        }
    };

    private getAttributeUsingStringAccessor(item: T, accessor: string): any {
        // please use normal function accessors, instead of string accessors, especially if you're getting some sub-sub-attribute of the row.
        //
        // This has been tested to work with one level (i.e., accessor='.name'). It should work with arbitrary levels of nesting, but hasn't been tested to.
        // Just don't use it. The react-table parser knows how to display columns using something like accessor='children[0].length', but this doesn't, and shouldn't.
        // You could execute the strings as javascript instead of parsing as below, but that's just asking for code-injection trouble.
        const accessorPieces = accessor.split(".");
        if (accessorPieces.length === 1) {
            // hack to make ts compiler stop complaining.
            return (item as { [key: string]: any })[accessor.toString()];
        } else {
            let piece: { [key: string]: any } = item as { [key: string]: any };
            for (const attr of accessorPieces) {
                if (piece.hasOwnProperty(attr)) {
                    piece = piece[attr];
                } else {
                    return undefined;
                }
            }
            return piece;
        }
    }

    private selectItem(e: any, item: any): void {
        const newItem = item.getData();

        if (!this.rowsAreClickable()) {
            return;
        }

        // have to re-check here (in addition to check in isFunction) because of typescript
        if (this.props.multiSelection && this.props.onSelectionChange !== undefined) {
            const selections: T[] = this.state.selections;
            const selectionsAsRows: T[] = this.state.selectionsAsRows;
            const existingItemIndex = this.state.selections.findIndex((select) => select === newItem);
            if (existingItemIndex >= 0) {
                selections.splice(existingItemIndex, 1);
                selectionsAsRows.splice(existingItemIndex, 1);
            } else {
                selections.push(newItem);
                selectionsAsRows.push(item);
            }

            // the data in tables get refreshed after we setState
            // so we loose the index, update the page after state
            // is changed.
            const page = item.getTable().getPage();
            this.setState({ selections, selectionsAsRows });
            this.props.onSelectionChange(this.state.selections);
            item.getTable().setPage(page);

            // select rows based on selection for view.
            this.state.selectionsAsRows.map((row: any) => {
                const index = row.getIndex();
                row.getTable().selectRow(index);
            });
        } else if (this.props.onSelect !== undefined) {
            this.setState({
                selections: [newItem]
            });
            this.props.onSelect(newItem);

            // select rows based on selection for view.
            const index = item.getIndex();
            item.getTable().selectRow(index);
        }
    }

    private rowsAreClickable(): boolean {
        return isFunction(this.props.onSelect) || isFunction(this.props.onSelectionChange);
    }

    private getSearchBox = () => {
        return (
            <div className={styles.actionBar}>
                <InputGroup
                    placeholder="Search..."
                    leftIcon="search"
                    value={this.state.query}
                    onChange={(e: any) => this.handleFilterChange(e)}
                    data-element-id="search-field"
                />
            </div>
        );
    };

    private handleFilterChange(event: any) {
        if (event && event.target) {
            this.setState({
                query: event.target.value
            });
        }
    }
}

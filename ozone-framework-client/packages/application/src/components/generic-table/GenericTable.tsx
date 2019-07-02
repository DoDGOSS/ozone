import React from "react";
import ReactTable, { Column } from "react-table";
import { InputGroup } from "@blueprintjs/core";

import * as styles from "./GenericTable.scss";

import { classNames, isFunction } from "../../utility";

interface Props<T> {
    getColumns: () => Column[];
    items: T[];
    title?: string;
    onSelect?: (newItem: T) => void;
    onSelectionChange?: (newItems: T[]) => void;
    multiSelection?: boolean;
    customFilter?: (items: T[], query: string, queryMatches: (msg: string, query: string) => boolean) => T[];
    filterable?: boolean;
    reactTableProps?: any;
    classNames?: any;
    searchCaseSensitive?: boolean;
}

interface State<T> {
    selections: T[];
    query: string;
}

export class GenericTable<T> extends React.Component<Props<T>, State<T>> {
    filterable: boolean;
    searchCaseSensitive: boolean;
    tableWidth: number = 0;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            selections: [],
            query: ""
        };
        this.filterable = !(props.filterable === false);
        this.searchCaseSensitive = props.searchCaseSensitive ? props.searchCaseSensitive : false;
    }

    render() {
        return (
            <div ref={(tableDiv) => this.setTableWidth(tableDiv)}>
                {this.filterable && this.getSearchBox()}
                <div className={styles.table}>
                    <ReactTable
                        data={this.getItems()}
                        getTheadThProps={this.removeHideableHeaders}
                        getTrProps={this.rowsAreClickable() ? this.rowProps : () => ""}
                        columns={this.getTableLayout()}
                        pageSizeOptions={this.getReasonablePageSizeOptions()}
                        {...this.buildReactTableProps()}
                    />
                </div>
            </div>
        );
    }

    // Unfinished attempt to allow you to specify column width by percentage, rather than pixel width.
    // No idea why they didn't build in percentage widths in the first place.
    private setTableWidth(tableDiv: any): void {
        if (tableDiv && tableDiv.clientWidth !== this.tableWidth) {
            this.tableWidth = tableDiv.clientWidth;
        }
    }

    private buildReactTableProps() {
        const props: { [key: string]: any } = {};

        props["minRows"] = 5;
        props["defaultPageSize"] = 5;
        props["showPagination"] = true;
        props["className"] = classNames("-striped -highlight");

        if (this.props.reactTableProps) {
            for (const p in this.props.reactTableProps) {
                if (this.props.reactTableProps.hasOwnProperty(p)) {
                    props[p] = this.props.reactTableProps[p];
                }
            }
            if (this.props.reactTableProps.className) {
                props["className"] = classNames("-striped -highlight", this.props.reactTableProps.className);
            }
        }
        return props;
    }

    private getReasonablePageSizeOptions(): number[] {
        const sizeOptions = [5, 10, 20, 25, 50, 100];
        const numItems = this.getItems().length;

        let i = 0;
        for (; i < sizeOptions.length; i++) {
            if (sizeOptions[i] > numItems) {
                break;
            }
        }
        return sizeOptions.slice(0, Math.floor(i + 1));
    }

    private rowsAreClickable(): boolean {
        return isFunction(this.props.onSelect) || isFunction(this.props.onSelectionChange);
    }

    private getTableLayout() {
        if (this.props.title) {
            return [
                {
                    Header: this.getTableMainHeader(this.props.title),
                    columns: this.convertColumnsWithPercentageWidths(this.props.getColumns())
                }
            ];
        } else {
            return this.props.getColumns();
        }
    }

    private convertColumnsWithPercentageWidths(columns: Column[]): Column[] {
        return columns;
        // if (this.tableWidth === 0) {
        //     return columns;
        // }
        //
        // for (const col of columns) {
        //     if (col.width && (typeof col.width === 'string') && (col.width.includes('%'))) {
        //         const percentageWidth: number = Number(mystring.replace('%','');)
        //         if (percentageWidth) {
        //             // table width is the full div, so account for borders....
        //             const convertedWidth: number = Math.floor(percentageWidth/100 * (this.tableWidth*0.9));
        //         }
        //     }
        // }
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
    private checkColumnsRecursively(item: T, query: string, columns: Column[]): boolean {
        for (const col of columns) {
            if (this.columnAccessorMatchesQuery(item, query, col)) {
                return true;
            } else if (col.columns && col.columns instanceof Array) {
                if (this.checkColumnsRecursively(item, query, col.columns)) {
                    return true;
                }
            }
        }
        return false;
    }

    private columnAccessorMatchesQuery(item: T, query: string, column: Column) {
        if (column.accessor) {
            let valueInColumnForItem: any;
            if (typeof column.accessor === "function") {
                valueInColumnForItem = column.accessor(item);
                // some tables still use string accessors
            } else if (typeof column.accessor === "string") {
                valueInColumnForItem = this.getAttributeUsingStringAccessor(item, column.accessor.toString());
            }
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

    private getTableMainHeader(title: string): any {
        return <div>{title && <AlignedDiv message={title} alignment="left" />}</div>;
    }

    // derived from https://github.com/tannerlinsley/react-table/issues/508#issuecomment-380392755
    private removeHideableHeaders(state: any, rowInfo: any, column: Column | undefined) {
        if (column && column.Header === "hideMe") {
            return { style: { display: "none" } }; // override style
        }
        return {};
    }

    // derived from https://stackoverflow.com/questions/44845372
    private rowProps = (state: State<T>, rowInfo: any) => {
        let propsForRow = {};
        if (rowInfo && rowInfo.row) {
            propsForRow = {
                onClick: (e: any) => {
                    this.selectItem(rowInfo.original);
                }
            };

            // Should be able to do a simple compare, since the selected objects were just taken directly from the items list.
            // So they should be the exact same items.
            // If we change things to have some items start pre-selected, then we will have to add a comparator function.
            // Though that'd only need to be used when this component initializes.
            if (this.state.selections.find((select) => select === rowInfo.original) !== undefined) {
                propsForRow = {
                    onClick: (e: any) => {
                        this.selectItem(rowInfo.original);
                    },
                    style: {
                        background: "#00afec",
                        color: "white"
                    }
                };
            }
        }
        return propsForRow;
    };

    private selectItem(newItem: T): void {
        if (!this.rowsAreClickable()) {
            return;
        }
        // have to re-check here (in addition to check in isFunction) because of typescript
        if (this.props.multiSelection === true && this.props.onSelectionChange !== undefined) {
            const selections: T[] = this.state.selections;
            const existingItemIndex = this.state.selections.findIndex((select) => select === newItem);
            if (existingItemIndex >= 0) {
                selections.splice(existingItemIndex, 1);
            } else {
                selections.push(newItem);
            }

            this.setState({ selections });
            this.props.onSelectionChange(this.state.selections);
        } else if (this.props.onSelect !== undefined) {
            this.setState({
                selections: [newItem]
            });
            this.props.onSelect(newItem);
        }
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

const AlignedDiv: React.FC<{ message: React.ReactNode; alignment: "left" | "right" | "center" }> = (props) => {
    const { alignment, message } = props;
    return <div style={{ textAlign: alignment }}>{message}</div>;
};

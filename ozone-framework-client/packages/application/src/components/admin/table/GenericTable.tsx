import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, InputGroup, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { mainStore } from "../../../stores/MainStore";
import * as styles from "../widgets/Widgets.scss";

import { classNames, isFunction } from "../../../utility";

interface Props<T> {
    getColumns: () => any[];
    items: T[];
    title?: string;
    onSelect?: (newItem: T) => void;
    onSelectionChange?: (newItems: T[]) => void;
    multiSelection?: boolean;
    customFilter?: (items: T[], query: string, queryMatches: (msg: string, query: string) => boolean) => T[];
    filterable?: boolean;
    getReactTableProps?: () => any;
    classNames?: any;
}

interface State<T> {
    pageSize: number;
    selections: T[];
    query: string;
}

export class GenericTable<T> extends React.Component<Props<T>, State<T>> {
    filterable: boolean;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            pageSize:
                this.props.getReactTableProps && this.props.getReactTableProps().pageSize
                    ? this.props.getReactTableProps().pageSize
                    : 10,
            selections: [],
            query: ""
        };
        this.filterable = !(props.filterable === false);
    }

    render() {
        return (
            <div className={styles.table}>
                {this.filterable && this.getSearchBox()}
                <ReactTable
                    data={this.getItems()}
                    pageSize={this.state.pageSize}
                    getTheadThProps={this.removeHideableHeaders}
                    getTrProps={this.rowsAreClickable() ? this.clickableRowProps : () => ""}
                    className={classNames("striped", mainStore.getTheme(), this.props.classNames)}
                    columns={this.getTableLayout()}
                    {...this.buildReactTableProps()}
                />
            </div>
        );
    }

    private buildReactTableProps() {
        const reactTableProps: { [key: string]: any } = {};

        reactTableProps["minRows"] = 5;
        reactTableProps["showPagination"] = true;

        if (this.props.getReactTableProps) {
            const inputProps = this.props.getReactTableProps();
            for (const p in inputProps) {
                if (inputProps.hasOwnProperty(p)) {
                    reactTableProps[p] = inputProps[p];
                }
            }
        }
        return reactTableProps;
    }

    private rowsAreClickable(): boolean {
        return isFunction(this.props.onSelect) || isFunction(this.props.onSelectionChange);
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

    private getTableLayout() {
        if (this.props.title) {
            return [
                {
                    Header: this.getTableMainHeader(this.props.title),
                    columns: this.props.getColumns()
                }
            ];
        } else {
            return this.props.getColumns();
        }
    }

    private someColumnOfItemContainsQuery(item: T, query: string): boolean {
        for (const col of this.columnsWithAccessor()) {
            const valueInColumnForItem = col.accessor(item);
            if (valueInColumnForItem && this.queryMatches(valueInColumnForItem.toString(), query)) {
                return true;
            }
        }
        return false;
    }

    private columnsWithAccessor(): any[] {
        return this.props.getColumns().filter((c: any) => isFunction(c.accessor));
    }

    private queryMatches(text: string, query: string): boolean {
        return text.toLowerCase().includes(query.toLowerCase());
    }

    private getTableMainHeader(title: string): any {
        return <div>{title && <AlignedDiv message={title} alignment="left" />}</div>;
    }

    // derived from https://github.com/tannerlinsley/react-table/issues/508#issuecomment-380392755
    private removeHideableHeaders(state: any, rowInfo: any, column: any) {
        if (column.Header === "hideMe") {
            return { style: { display: "none" } }; // override style
        }
        return {};
    }

    // derived from https://stackoverflow.com/questions/44845372
    private clickableRowProps = (state: State<T>, rowInfo: any) => {
        let propsForRow = {};
        if (rowInfo && rowInfo.row) {
            propsForRow = {
                onClick: (e: any) => {
                    this.selectItem(rowInfo.original);
                },
                style: {
                    color: "black"
                }
            };

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

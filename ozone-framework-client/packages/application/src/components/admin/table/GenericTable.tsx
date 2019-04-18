import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, InputGroup, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import * as styles from "../widgets/Widgets.scss";

import { mainStore } from "../../../stores/MainStore";
import { classNames, isFunction } from "../../../utility";

interface Props<T> {
    title?: string;
    getColumns: () => any[];
    items: T[];
    customFilter?: (items: T[], query: string) => T[];
    pageSize?: number;
    showPagination?: boolean;
    minRows?: number;
    onSelect?: (newItem: T) => void;
    onSelectionChange?: (newItems: T[]) => void;
    multiSelection?: boolean;
}

interface State<T> {
    pageSize: number;
    selections: T[];
    query: string;
}

export class GenericTable<T> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        super(props);
        this.state = {
            pageSize: this.props.pageSize ? this.props.pageSize : 10,
            selections: [],
            query: ""
        };
    }

    render() {
        return (
            <div className={styles.table}>
                {this.getSearchBox()}
                <ReactTable
                    data={this.getItems()}
                    showPagination={this.props.showPagination !== undefined ? this.props.showPagination : true}
                    pageSize={this.state.pageSize}
                    getTrProps={this.rowsAreClickable() ? this.clickableRowProps : () => ""}
                    minRows={this.props.minRows !== undefined ? this.props.minRows : 5}
                    className={classNames("striped", mainStore.getTheme())}
                    columns={this.getTableLayout()}
                />
            </div>
        );
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

    private rowsAreClickable(): boolean {
        return isFunction(this.props.onSelect) || isFunction(this.props.onSelectionChange);
    }

    private getItems(): any[] {
        // have to re-check here (in addition to check in isFunction) because of typescript
        if (this.props.customFilter && isFunction(this.props.customFilter)) {
            return this.props.customFilter(this.props.items, this.state.query);
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
        return <div>{this.alignedDiv(title, "left")}</div>;
    }

    // derived from https://stackoverflow.com/questions/44845372
    private clickableRowProps = (state: State<T>, rowInfo: any) => {
        let propsForRow = {};
        if (rowInfo && rowInfo.row) {
            propsForRow = {
                onClick: (e: any) => {
                    this.selectItem(rowInfo.original);
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

    private alignedDiv(message: any, alignment: "left" | "right" | "center"): any {
        return <div style={{ textAlign: alignment }}>{message}</div>;
    }
}

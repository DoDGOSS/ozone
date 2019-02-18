import * as React from "react";

import { Button, Classes, Dialog, InputGroup } from "@blueprintjs/core";
import { AdminTable } from "../admin/table/AdminTable";
import { Column } from "react-table";

import * as styles from "./index.scss";

/**
 * properties for TableSelectionDialog extended classes
 */
export class TableSelectionDialogProps<T> {
    show: boolean; /** show or hide the dialog */
    title?: string; /** title for the dialog */
    columns: Column<any>[]; /** react-table Column definition for the displayed table */
    confirmHandler: (
        selected: Array<T>
    ) => void; /** handler for the Submit button - returns the array of selected elements */
    cancelHandler: () => void; /** handler for the cancel button */
}

/**
 * state holder for TableSelectionDialog instances
 */
export interface TableSelectionDialogState<T> {
    selections: Array<T> /** available selections for the displayed table */;
    selected: Array<T> /** selected values from the displayed table */;
    filtered: Array<T> /** filtered / searched values for the displayed table */;
    filter: string /** currently entered filter / search string */;
    loading: boolean /** loading flag for fetching new data */;
    pageSize: number /** paging size for the table of data */;
}

export abstract class TableSelectionDialog<T> extends React.Component<
    TableSelectionDialogProps<T>,
    TableSelectionDialogState<T>
> {
    constructor(props: TableSelectionDialogProps<T>) {
        super(props);

        this.state = {
            selections: [],
            selected: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5
        };
    }

    componentDidMount() {
        this.getSelections();
    }

    render() {
        let data = this.state.selections;
        const filter = this.state.filter.toLowerCase();

        if (filter) {
            data = data.filter((row) => this.filterMatch(filter, row));
        }

        return (
            <div>
                <Dialog
                    isOpen={this.props.show}
                    isCloseButtonShown={false}
                    title={this.props.title}
                    data-element-id="table-selector"
                >
                    <div className={Classes.DIALOG_BODY}>
                        <div data-element-id="table-selector-dialog">
                            <div className={styles.searchBar}>
                                <InputGroup
                                    placeholder="Search..."
                                    leftIcon="search"
                                    value={this.state.filter}
                                    onChange={(e: any) => this.setState({ filter: e.target.value })}
                                    data-element-id="table-selector-search-field"
                                />
                            </div>

                            <AdminTable
                                data={data}
                                columns={this.props.columns}
                                loading={this.state.loading}
                                pageSize={this.state.pageSize}
                                getTrProps={this.injectRowHooks}
                            />
                        </div>
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.handleConfirm} data-element-id="table-selector-confirm">
                                OK
                            </Button>
                            <Button onClick={this.handleCancel} data-element-id="table-selector-cancel">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    /**
     * function to fetch the data for the table
     */
    protected abstract async dataLoader(): Promise<Array<T>>;

    /**
     * function to determine if the provided element matches the filter / search string
     *
     * @param filter filter string
     * @param value object to test for matching state to the provided filter
     */
    protected abstract filterMatch(filter: string, value: T): boolean;

    /**
     * function to determine if the selected row backing object matches the provided element
     * @param selectedRow selected row backing object
     * @param value object to test for matching state to the provided row backing object
     */
    protected abstract selectionMatch(selectedRow: T, value: T): boolean;

    private handleConfirm = (event: React.MouseEvent<HTMLElement>) => {
        this.props.confirmHandler(this.state.selected);
    };

    private handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        this.props.cancelHandler();
    };

    private isRowSelected(rowInfo: any): boolean {
        if (rowInfo === undefined) {
            return false;
        }

        return rowInfo
            ? this.state.selected.find((value: T) => this.selectionMatch(rowInfo.original, value)) !== undefined
            : false;
    }

    private injectRowHooks = (state: any, rowInfo: any) => {
        return {
            className: this.isRowSelected(rowInfo) ? styles.highlightRow : "",
            onClick: (e: MouseEvent, handleOriginal: Function) => {
                if (this.isRowSelected(rowInfo)) {
                    this.setState({
                        selected: this.state.selected.filter(
                            (value: T) => !this.selectionMatch(rowInfo.original, value)
                        )
                    });
                } else {
                    const selected: Array<T> = this.state.selected;
                    selected.push(rowInfo.original);
                    this.setState({
                        selected
                    });
                }

                if (handleOriginal) {
                    handleOriginal();
                }
            }
        };
    };

    private getSelections = async () => {
        const selections = await this.dataLoader();

        this.setState({
            selections,
            loading: false
        });
    };
}

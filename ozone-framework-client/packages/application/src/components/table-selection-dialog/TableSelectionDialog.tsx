import * as React from "react";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../generic-table/GenericTable";
import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";

import * as styles from "./index.scss";

/**
 * Props that dialogs based on this should all take in - should all be the same, so just put it here.
 */
export class SelectionDialogProps<T> {
    show: boolean; /** show or hide the dialog */
    onSubmit: (selected: any[]) => void; /** handler for the Submit button - returns the array of selected elements */
    onClose: () => void; /** handler for the cancel button */
    defaultPageSize?: number;
}

/**
 * Props that this table should take in, in addition to the above.
 */
class TableSelectionDialogProps<T> extends SelectionDialogProps<T> {
    title?: string; /** title for the dialog */
    items?: Array<T>; /** available items for the displayed table */
    getItems?: () => Promise<Array<T>>; /** available items for the displayed table */
    columns: ColumnTabulator<T>[]; /** react-tabulator Column definition for the displayed table */
}

/**
 * state holder for TableSelectionDialog instances
 */
export interface TableSelectionDialogState<T> {
    selected: Array<T> /** selected values from the displayed table */;
    loading: boolean /** loading flag for fetching new data */;
    allItems: Array<T>;
}

export abstract class TableSelectionDialog<T> extends React.Component<
    TableSelectionDialogProps<T>,
    TableSelectionDialogState<T>
> {
    defaultPageSize: number = 5;

    protected constructor(props: TableSelectionDialogProps<T>) {
        super(props);

        this.state = {
            selected: [],
            loading: true,
            allItems: props.items ? props.items : []
        };
        if (props.defaultPageSize) {
            this.defaultPageSize = props.defaultPageSize;
        }
    }

    componentDidMount() {
        this.refreshItemList();
    }

    render() {
        return (
            <div>
                <Dialog
                    isOpen={this.props.show}
                    isCloseButtonShown={false}
                    title={this.props.title}
                    data-element-id="table-selector"
                    className={classNames(styles.dialog, mainStore.getTheme())}
                    onClose={this.props.onClose}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <div data-element-id="table-selector-dialog">
                            <GenericTable
                                items={this.state.allItems}
                                getColumns={() => this.props.columns}
                                multiSelection={true}
                                onSelectionChange={this.setSelected}
                                tableProps={{
                                    loading: this.state.loading,
                                    paginationSize: this.defaultPageSize
                                }}
                            />
                        </div>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.submit} data-element-id="table-selector-confirm">
                                OK
                            </Button>
                            <Button onClick={this.props.onClose} data-element-id="table-selector-cancel">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    setSelected = (newItems: T[]): void => {
        this.setState({
            selected: newItems
        });
    };

    refreshItemList(): void {
        if (this.props.items === undefined && this.props.getItems !== undefined) {
            this.props.getItems().then((allItems: Array<T>) => {
                this.setState({
                    allItems,
                    loading: false
                });
            });
        }
    }

    submit = () => {
        this.props.onSubmit(this.state.selected);
        this.props.onClose();
    };
}

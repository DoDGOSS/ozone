import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, InputGroup, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import * as styles from "../widgets/Widgets.scss";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { mainStore } from "../../../stores/MainStore";
import { CancelButton, CheckBox, FormError, HiddenField, SubmitButton, TextField } from "../../../form";
import { classNames } from "../../../utility";


interface Props {
    title: string;
    getColumns: () => any[]
    items: T[];
    onSelect?: () => {};
    customFilter?: (items: T[], query: string) => T[];
}

interface State {
    loading: boolean;
    pageSize: number;
    selected: T | undefined;
    query: string;
}

export class GenericTable<T> extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            pageSize: 10,
            selected: undefined,
            query: ''
        };
    }

    render() {
        return (
            <div className={styles.table}>
                <ReactTable
                    title={this.props.title}
                    data={this.getItems()}
                    showPagination={true}
                    pageSize={this.state.pageSize}
                    getTrProps={this.rowsAreClickable() ? this.clickableRowProps : (() => '')}
                    minRows={5}
                    className={classNames('striped', mainStore.getTheme())}
                    columns={[{
                        Header: this.getTableMainHeader(this.props.title),
                        columns: this.props.getColumns()
                    }]}
                    {...this.props}
                />
            </div>
        );
    }

    private rowsAreClickable(): boolean {
        return this.props.onSelect && (typeof this.props.onSelect === 'function');
    }

    private getItems(): any[] {
        if (this.props.customFilter && (typeof this.props.customFilter === 'function')) {
            return this.props.customFilter(this.props.items, this.state.query);
        }
        else {
            return this.filter(this.props.items, this.state.query);
        }
    }

    filter(items: T[], query: string): T[] {
        if (query === '') {
            return items;
        }
        return items.filter(item => this.someColumnOfItemContainsQuery(item, query));
    }

    someColumnOfItemContainsQuery(item: T, query: string): boolean {
        for (let col of this.columnsWithAccessor()) {
            let valueInColumnForItem = col.accessor(item);
            if (valueInColumnForItem && this.queryMatches(valueInColumnForItem.toString(), query)) {
                return true;
            }
        }
        return false;
    }

    columnsWithAccessor(): any[] {
        return this.props.getColumns().filter(c => (c.accessor && typeof c.accessor === "function"));
    }

    private queryMatches(text: string, query: string): boolean {
        return text.toLowerCase().includes(query.toLowerCase());
    }



    private getTableMainHeader(title: string): any {
        return (<div>
                    {this.alignedDiv(title, 'left')}
                    {this.alignedDiv(this.getSearchBox(), 'right')}
                </div>);
    }

    // derived from https://stackoverflow.com/questions/44845372
    private clickableRowProps = (state: State, rowInfo: any) => {
        let propsForRow = {};
        if (rowInfo && rowInfo.row) {
            propsForRow =  {onClick: (e: any) => {this.setSelected(rowInfo.original);}}

            if (rowInfo.original === this.state.selected) {
                propsForRow = {
                    onClick: (e: any) => {this.setSelected(rowInfo.original);},
                    style: {
                        background: '#00afec',
                        color: 'white'
                    }
                }
            }
        }
        return propsForRow;
    }

    setSelected(newItem: T): void {
        this.setState({
            selected: newItem
        });
        this.props.onSelect(newItem)
    }

    // componentDidUpdate() {
    //     this.searchInput.focus();
    // }

    getSearchBox = () => {
        // opted for the 'allow re-render but re-set focus and value on every render' approach,
        // because I couldn't figure out how to easily tell it to re-use this input field without
        // re-rendering it when its parent re-renders.
        return (
            <div className={styles.actionBar}>
                <InputGroup
                    placeholder="Search..."
                    leftIcon="search"
                    value={this.state.query}
                    onChange={e => this.handleFilterChange(e)}
                    data-element-id="search-field"
                    /* ref={(input) => { this.searchInput = input; }} */
                />
            </div>
         )
      }

    private handleFilterChange(event: any) {
        if (event && event.target) {
            this.setState({
                query: event.target.value
            });
        }
     }

    private alignedDiv(message: any, alignment: 'left' | 'right' | 'center'): any {
        return (<div style={{textAlign: alignment}}>
                    {message}
                </div>);
    }
}

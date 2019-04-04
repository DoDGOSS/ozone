import * as React from "react";
import ReactTable, { Column } from "react-table";
import { MenuItem, Tab, Tabs, Button } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import * as styles from "../Widgets.scss";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { CancelButton, CheckBox, FormError, HiddenField, SubmitButton, TextField } from "../../../form";

import { Intent } from '../../../../models/Intent';
import { IntentDialog } from './IntentDialog';

interface State {
    loading: boolean;
    pageSize: number;
    allIntentGroups: IntentGroup[];
    expandedRows: {[Key: number]: boolean};
    selectedIntent: Intent | undefined;
    query: string;
    dialogOpen: boolean;
}

interface Props {
    updatingWidget: any;
    onChange: (intentGroups: IntentsGroupedByPermission) => any
}

interface CompressedIntentGroup {
    action:string;
    dataTypes: string[];
}

interface IntentsGroupedByPermission {
    send: CompressedIntentGroup[];
    receive: CompressedIntentGroup[];
}

interface IntentGroup {
    action: string;
    intents: Intent[];
}

export class IntentsPanel extends React.Component<Props, State> {
    smallBoolBoxWidth = 100; // hard-coded pixel width for send/receive. Not good, but haven't found any way to use percentages
    searchInput: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            pageSize: 10,
            allIntentGroups: this.getIntentGroupsFromWidget(this.props.updatingWidget),
            expandedRows: this.getAllGroupsAsExpanded(),
            selectedIntent: undefined,
            query: '',
            dialogOpen: false
        };
    }

    render() {
        let dialog = null;
        if (this.state.dialogOpen) {
            dialog = this.intentDialog();
        }
        return (
            <div className={styles.table}>
                {dialog}
                {this.mainTable()}
                {this.actionButtons()}
            </div>
        );
    }

    private mainTable(): any {
        return <ReactTable
            key="mainTable"
            data={this.getIntentGroups()}
            columns={this.getMainTableColumns()}
            expanderDefaults={
                {sortable: true,
                resizable: true,
                filterable: false}
            }
            SubComponent={(rowObject) => this.getIntentActionGroup(rowObject.original.intents)}
            defaultPageSize={20}
            minRows={0}
            onExpandedChange={(newExpanded, index, event) => this.handleRowExpanded(newExpanded, index, event)}
            expanded={this.state.expandedRows}
            getTheadThProps={this.removeHideableHeaders}
            className="-striped -highlight"
        />
    }

    private actionButtons(): any {
        return (<div>
            <Button text="Create" onClick={this.createIntent}/>
            <Button text="Edit" onClick={this.editIntent}/>
            <Button text="Delete" onClick={this.deleteIntentAndSave}/>
        </div>);
    }

    private intentDialog = () => {}

    private createIntentDialog = () => {
        return <IntentDialog
            isOpen = {this.state.dialogOpen}
            onClose = {this.closeDialog}
            onSubmit = {this.onFormSubmit}
        />
    }
    private editIntentDialog = () => {
        return <IntentDialog
            isOpen = {this.state.dialogOpen}
            onClose = {this.closeDialog}
            intentToEdit = {this.state.selectedIntent}
            onSubmit = {this.onFormSubmit}
        />
    }

    createIntent = (): void => {
        this.dismissSelection();
        this.intentDialog = this.createIntentDialog;
        this.openDialog();
    }

    editIntent = (): void => {
        if (this.state.selectedIntent) {
            this.intentDialog = this.editIntentDialog;
            this.openDialog();
        }
    }

    deleteIntentAndSave = (): void => {
        if (this.state.selectedIntent) {
            // and then clear its data, so a subsequent Edit click doesn't open up with the deleted intent's values
            this.removeIntent(this.state.selectedIntent);
            this.dismissSelection();
            this.saveIntents();
        }
    }

    openDialog = (): void => {
        this.setState({
            dialogOpen: true
        });
    }
    closeDialog = (): void => {
        this.setState({
            dialogOpen: false
        });
    }
    dismissSelection = (): void => {
        this.setState({
            selectedIntent: undefined
        });
    }

    onFormSubmit = (newIntent: any): void => {
        if (this.state.selectedIntent){
            this.updateSelectedIntent(newIntent);
        }
        else {
            this.addIntent(newIntent);
        }
        this.saveIntents();
    }

    updateSelectedIntent(intent: Intent): void {
        this.removeSelected();
        this.addIntent(intent);
    }

    removeSelected(): void {
        if (this.state.selectedIntent){
            this.removeIntent(this.state.selectedIntent);
        }
    }

    removeIntent(intent: Intent): void {
        let existingGroupIndex = this.state.allIntentGroups.findIndex(group => group.action === intent.action);

        if (existingGroupIndex !== -1) {
            let existingGroup = this.state.allIntentGroups[existingGroupIndex];

            let indexToRemove = existingGroup.intents.findIndex(i => i.dataType === intent.dataType);

            if (indexToRemove !== -1) {
                existingGroup.intents.splice(indexToRemove, 1);

                if (existingGroup.intents.length === 0) {
                    this.state.allIntentGroups.splice(existingGroupIndex, 1);
                }
            }
        }
    }

    addIntent(newIntent: Intent): void {
        let existingGroup = this.state.allIntentGroups.find(group => group.action === newIntent.action);
        if (existingGroup) {
            let existingIntent = existingGroup.intents.find(i => i.dataType === newIntent.dataType);
            if (existingIntent) {
                existingIntent.send = newIntent.send;
                existingIntent.receive = newIntent.receive;
            }
            else {
                existingGroup.intents.push(newIntent);
            }
        }
        else {
            let newGroup = {action: newIntent.action, intents: [newIntent]};
            this.state.allIntentGroups.push(newGroup);
            this.expandGroup(newGroup);
        }
    }

    expandGroup(groupToExpand: IntentGroup): void {
        let groupIndex = this.state.allIntentGroups.findIndex(group => group.action === groupToExpand.action);
        if (groupIndex !== -1) {
            this.state.expandedRows[groupIndex] = true;
        }
    }

    saveIntents(): void {
        let formattedIntents = this.getIntentsInPartitionedFormat()
        this.props.onChange(formattedIntents);
    }

    private getIntentsInPartitionedFormat(): IntentsGroupedByPermission {
        return {
            send: this.getIntentsWithPermission(this.state.allIntentGroups, 'send'),
            receive: this.getIntentsWithPermission(this.state.allIntentGroups, 'receive')
        };
    }

    private getIntentsWithPermission(allIntentGroups: IntentGroup[], permission: 'send'|'receive'): CompressedIntentGroup[] {
        let permitted: CompressedIntentGroup[] = [];
        for (let intentGroup of allIntentGroups) {
            let permittedIntents: Intent[] = intentGroup.intents.filter(intent => intent[permission]);
            if (permittedIntents.length > 0) {
                let newAction: CompressedIntentGroup = {action: intentGroup.action, dataTypes: []}
                for (let pIntent of permittedIntents) {
                    newAction.dataTypes.push(pIntent.dataType);
                }
                permitted.push(newAction);
            }
        }
        return permitted;
    }

    // derived from https://stackoverflow.com/questions/44845372
    private makeRowsClickableProps = (state: State, rowInfo: any) => {
        if (rowInfo && rowInfo.row) {
            return {
                onClick: (e: any) => {
                    this.setState({
                      selectedIntent: rowInfo.original
                    })
                },
                style: {
                    background: rowInfo.original === this.state.selectedIntent ? '#00afec' : 'white',
                    color: rowInfo.original === this.state.selectedIntent ? 'white' : 'black'
                }
            };
        }
        else {return {};}
    }

    /*
     * Must be done manually, otherwise sub-areas collapse on filter, sort, and tab-change.
     */
    private handleRowExpanded(newExpanded: any, index: number[], event: any): void {
        // clean newExpanded first. Don't know why it comes with {} instead of true, but it breaks if you keep it like that.
        for (let i = 0; i < newExpanded.length; i++) {
            if (newExpanded[i] === {}) {
                newExpanded[i] = true;
            }
        }
        this.setState({
            expandedRows: newExpanded
        });
    }

    componentDidUpdate() {
        this.searchInput.focus();
    }

    private getTableMainHeader(title: string): any {
        return (<div>
                    {this.alignedDiv(title, 'left')}
                    {this.alignedDiv(this.getSearchBox(), 'right')}
                </div>);
    }

    getSearchBox = () => {
        // opted for the 'allow re-render but re-set focus and value on every render' approach,
        // because I couldn't figure out how to easily tell it to re-use this input field without
        // re-rendering it when its parent re-renders.
        return (
          <input
              key='search'
              ref={(input) => { this.searchInput = input; }}
              value={this.state.query}
              placeholder="Search..."
              onChange={e => this.handleFilterChange(e)}
          />
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

    private getAllGroupsAsExpanded() {
        let groupsToInitializeAsExpanded: any = {};
        for (let i: number = 0 ; i < this.getIntentGroupsFromWidget(this.props.updatingWidget).length; i++) {
            groupsToInitializeAsExpanded[i] = true;
        }
        return groupsToInitializeAsExpanded;
    }

    private getIntentActionGroup(intents: Intent[]) {
        return <ReactTable
            key="intentActionGroup"
            data={intents}
            columns={this.getIntentSubTableColumns()}
            getTheadThProps={this.removeHideableHeaders}
            showPagination={false}
            getTrProps={this.makeRowsClickableProps}
            minRows={5}
            className="-striped -highlight"
        />
    }

    // derived from https://github.com/tannerlinsley/react-table/issues/508#issuecomment-380392755
    private removeHideableHeaders(state: any, rowInfo: any, column: any) {
        if (column.Header === 'hideMe') {
          return {style: { display: 'none' }};// override style
        }
      return {};
      }

    private getIntentGroupsFromWidget(widget: any): IntentGroup[] {
        let widgetIntents: IntentsGroupedByPermission = widget.intents;

        let permittedSendingGroups = this.getGroupsFromFormattedIntents(widgetIntents.send, 'send');
        let allIntentGroups = this.getGroupsFromFormattedIntents(widgetIntents.receive, 'receive', permittedSendingGroups);

        return allIntentGroups
    }


    private getGroupsFromFormattedIntents(
            actionGroups: CompressedIntentGroup[],
            direction: 'send'|'receive',
            existingGroups?: IntentGroup[]
    ): IntentGroup[] {
        let intentGroups: IntentGroup[] = [];
        if (existingGroups) {
            intentGroups = existingGroups;
        }

        for (let actionGroup of actionGroups) {
            for (let dataType of actionGroup.dataTypes) {

                let intent: Intent = {action: actionGroup.action, dataType: dataType, send: false, receive: false};

                if (direction === 'send' || direction === 'receive') {
                    intent[direction] = true;
                }

                let existingGroup: IntentGroup|undefined = intentGroups.find(iG => iG.action === intent.action);
                if (existingGroup) {
                    let existingIntent: Intent|undefined = existingGroup.intents.find(iG => iG.dataType === intent.dataType);
                    if (existingIntent) {
                        existingIntent.send = existingIntent.send || intent.send;
                        existingIntent.receive = existingIntent.receive || intent.receive;
                    }
                    else {
                        existingGroup.intents.push(intent);
                    }
                }
                else {
                    let newGroup: IntentGroup = {action: intent.action, intents: [intent]};
                    intentGroups.push(newGroup);
                }
            }
        }
        return intentGroups;
    }


    private getIntentGroups(): any {
        return this.filterIntentGroups(this.state.allIntentGroups);
    }


    private filterIntentGroups(intentGroups: IntentGroup[]): IntentGroup[] {
        if (this.state === undefined || this.state.query === '') {
            return intentGroups;
        }

        // leave in all actionGroups containing `term`, as well as all intents whose dataType includes `term`.
        // Remember it's {action:string, dataTypes:string[] }[],
        let filteredGroups: IntentGroup[] = intentGroups.filter(group => this.queryMatches(group.action, this.state.query));

        for (let group of intentGroups) {
            if (this.listContainsObject(filteredGroups, group)) {
                continue;
            }
            let matchingIntents = group.intents.filter(intent => this.queryMatches(intent.dataType, this.state.query))
            if (matchingIntents.length > 0) {
                filteredGroups.push( {action: group.action, intents: matchingIntents} )
            }
        }
        return filteredGroups;
    }

    private queryMatches(text: string, query: string) {
        return text.includes(query);
    }

    private getMainTableColumns(): any {
        let title = this.props.updatingWidget ? this.props.updatingWidget.namespace : 'Intents';
        return [{
            Header: () => this.getTableMainHeader(title),
            columns: [
            {
                Header: 'hideMe',
                expander: true,
                width: 35,
            },  {
                expander: true,
                Header: () => this.alignedDiv("Intent", 'left'),
                Expander: ({ isExpanded, ...rest }: any) =>
                    <div>
                        {rest.original.action}
                    </div>,
                style: {
                    textAlign: "left"
                }
            },  {
                Header: "Send",
                width: this.smallBoolBoxWidth,
            },  {
                Header: "Receive",
                width: this.smallBoolBoxWidth,
            }]
        }];
    }

    private getIntentSubTableColumns(): any {
        return [
        {
            Header: 'hideMe',
            id: 'dataType',
            accessor: (intent: Intent) => intent.dataType,
            style: {
                'paddingLeft': "4%",
                textAlign: "left"
            }
        },  {
            Header: 'hideMe',
            id: 'send',
            accessor: (intent: Intent) => this.dotCharacter(intent.send),
            width: this.smallBoolBoxWidth,
            style: {
                textAlign: "center"
            }
        },  {
            Header: 'hideMe',
            id: 'receive',
            accessor: (intent: Intent) => this.dotCharacter(intent.receive),
            width: this.smallBoolBoxWidth,
            style: {
                textAlign: "center"
            }
        }]
    }

    private dotCharacter(returnDot: boolean) {
        return returnDot ? <span>&#11044;</span>: <span></span>;
    }

    private listContainsObject(list: any[], obj: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }
}

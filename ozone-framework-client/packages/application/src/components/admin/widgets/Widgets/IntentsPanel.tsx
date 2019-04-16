import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button } from "@blueprintjs/core";
import ReactTable from "react-table";

import { Intent } from "../../../../models/compat";

import { IntentDialog } from "./IntentDialog";
import { mainStore } from "../../../../stores/MainStore";
import { classNames } from "../../../../utility";

interface IntentsGroupedByPermission {
    send: CompressedIntentGroup[];
    receive: CompressedIntentGroup[];
}

interface CompressedIntentGroup {
    action: string;
    dataTypes: string[];
}

interface IntentGroup {
    action: string;
    intents: Intent[];
}

export interface IntentsPanelProps {
    updatingWidget: any;
    onChange: (intentGroups: IntentsGroupedByPermission) => any;
}

interface IntentsPanelState {
    loading: boolean;
    pageSize: number;
    allIntentGroups: IntentGroup[];
    expandedRows: { [Key: number]: boolean };
    selectedIntent: Intent | undefined;
    query: string;
    dialogOpen: boolean;
    dialog: React.ReactNode;
}

export class IntentsPanel extends React.Component<IntentsPanelProps, IntentsPanelState> {
    smallBoolBoxWidth = 100; // hard-coded pixel width for send/receive. Not good, but haven't found any way to use percentages
    searchInput: any;

    constructor(props: IntentsPanelProps) {
        super(props);
        this.state = {
            loading: false,
            pageSize: 10,
            allIntentGroups: this.getIntentGroupsFromWidget(this.props.updatingWidget),
            expandedRows: this.getAllGroupsAsExpanded(),
            selectedIntent: undefined,
            query: "",
            dialogOpen: false,
            dialog: null
        };
    }

    componentDidUpdate() {
        this.searchInput.focus();
    }

    render() {
        let dialog = null;
        if (this.state.dialogOpen) {
            dialog = this.state.dialog;
        }
        return (
            <div className={styles.table}>
                {dialog}
                {this.mainTable()}
                {this.actionButtons()}
            </div>
        );
    }

    mainTable(): any {
        return (
            <ReactTable
                key="mainTable"
                data={this.getIntentGroups()}
                columns={this.getMainTableColumns()}
                expanderDefaults={{
                    sortable: true,
                    resizable: true,
                    filterable: false
                }}
                SubComponent={(rowObject) => this.getIntentActionGroup(rowObject.original.intents)}
                defaultPageSize={20}
                minRows={5}
                onExpandedChange={(newExpanded, index, event) => this.handleRowExpanded(newExpanded, index, event)}
                expanded={this.state.expandedRows}
                getTheadThProps={this.removeHideableHeaders}
                className={classNames("-striped -highlight",mainStore.getTheme())}
            />
        );
    }

    actionButtons(): any {
        return (
            <div>
                <Button text="Create" onClick={this.createIntent} />
                <Button text="Edit" onClick={this.editIntent} />
                <Button text="Delete" onClick={this.deleteIntentAndSave} />
            </div>
        );
    }

    createIntentDialog = () => {
        return <IntentDialog isOpen={this.state.dialogOpen} onClose={this.closeDialog} onSubmit={this.onFormSubmit} />;
    };

    editIntentDialog = () => {
        return (
            <IntentDialog
                isOpen={this.state.dialogOpen}
                onClose={this.closeDialog}
                intentToEdit={this.state.selectedIntent}
                onSubmit={this.onFormSubmit}
            />
        );
    };

    createIntent = (): void => {
        this.dismissSelection();
        this.openDialog(this.createIntentDialog);
    };

    editIntent = (): void => {
        if (this.state.selectedIntent) {
            this.openDialog(this.editIntentDialog);
        }
    };

    deleteIntentAndSave = (): void => {
        if (this.state.selectedIntent) {
            // and then clear its data, so a subsequent Edit click doesn't open up with the deleted intent's values
            this.removeIntent(this.state.selectedIntent);
            this.dismissSelection();
            this.saveIntents();
        }
    };

    openDialog = (createDialog: () => React.ReactNode): void => {
        this.setState({
            dialogOpen: true,
            dialog: createDialog()
        });
    };
    closeDialog = (): void => {
        this.setState({
            dialogOpen: false,
            dialog: null
        });
    };
    dismissSelection = (): void => {
        this.setState({
            selectedIntent: undefined
        });
    };

    onFormSubmit = (newIntent: any): void => {
        if (this.state.selectedIntent) {
            this.updateSelectedIntent(newIntent);
        } else {
            this.addIntent(newIntent);
        }
        this.saveIntents();
    };

    updateSelectedIntent(intent: Intent): void {
        this.removeSelected();
        this.addIntent(intent);
    }

    removeSelected(): void {
        if (this.state.selectedIntent) {
            this.removeIntent(this.state.selectedIntent);
        }
    }

    removeIntent(intent: Intent): void {
        const existingGroupIndex = this.state.allIntentGroups.findIndex((group) => group.action === intent.action);

        if (existingGroupIndex !== -1) {
            const existingGroup = this.state.allIntentGroups[existingGroupIndex];

            const indexToRemove = existingGroup.intents.findIndex((i) => i.dataType === intent.dataType);

            if (indexToRemove !== -1) {
                existingGroup.intents.splice(indexToRemove, 1);

                if (existingGroup.intents.length === 0) {
                    this.state.allIntentGroups.splice(existingGroupIndex, 1);
                }
            }
        }
    }

    addIntent(newIntent: Intent): void {
        const existingGroup = this.state.allIntentGroups.find((group) => group.action === newIntent.action);
        if (existingGroup) {
            const existingIntent = existingGroup.intents.find((i) => i.dataType === newIntent.dataType);
            if (existingIntent) {
                existingIntent.send = newIntent.send;
                existingIntent.receive = newIntent.receive;
            } else {
                existingGroup.intents.push(newIntent);
            }
        } else {
            const newGroup = { action: newIntent.action, intents: [newIntent] };
            this.state.allIntentGroups.push(newGroup);
            this.expandGroup(newGroup);
        }
    }

    expandGroup(groupToExpand: IntentGroup): void {
        const groupIndex = this.state.allIntentGroups.findIndex((group) => group.action === groupToExpand.action);
        if (groupIndex !== -1) {
            this.state.expandedRows[groupIndex] = true;
        }
    }

    saveIntents(): void {
        const formattedIntents = this.getIntentsInPartitionedFormat();
        this.props.onChange(formattedIntents);
    }

    getIntentsInPartitionedFormat(): IntentsGroupedByPermission {
        return {
            send: this.getIntentsWithPermission(this.state.allIntentGroups, "send"),
            receive: this.getIntentsWithPermission(this.state.allIntentGroups, "receive")
        };
    }

    getIntentsWithPermission(allIntentGroups: IntentGroup[], permission: "send" | "receive"): CompressedIntentGroup[] {
        const permitted: CompressedIntentGroup[] = [];
        for (const intentGroup of allIntentGroups) {
            const permittedIntents: Intent[] = intentGroup.intents.filter((intent) => intent[permission]);
            if (permittedIntents.length > 0) {
                const newAction: CompressedIntentGroup = { action: intentGroup.action, dataTypes: [] };
                for (const pIntent of permittedIntents) {
                    newAction.dataTypes.push(pIntent.dataType);
                }
                permitted.push(newAction);
            }
        }
        return permitted;
    }

    // derived from https://stackoverflow.com/questions/44845372
    makeRowsClickableProps = (state: IntentsPanelState, rowInfo: any) => {
        if (rowInfo && rowInfo.row) {
            return {
                onClick: () => {
                    this.setState({
                        selectedIntent: rowInfo.original
                    });
                },
                style: {
                    // background: rowInfo.original === this.state.selectedIntent ? "#00afec" : "white",
                    // color: rowInfo.original === this.state.selectedIntent ? "white" : "black"
                    border: rowInfo.original === this.state.selectedIntent ? "2px solid #48aff0":"none"
                }
            };
        } else {
            return {};
        }
    };

    /*
     * Must be done manually, otherwise sub-areas collapse on filter, sort, and tab-change.
     */
    handleRowExpanded(newExpanded: any, index: number[], event: any): void {
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

    getTableMainHeader(title: string): React.ReactNode {
        return (
            <div>
                <AlignedDiv message={title} alignment="left" />
                <AlignedDiv message={this.getSearchBox()} alignment="right" />
            </div>
        );
    }

    getSearchBox(): React.ReactNode {
        // opted for the 'allow re-render but re-set focus and value on every render' approach,
        // because I couldn't figure out how to easily tell it to re-use this input field without
        // re-rendering it when its parent re-renders.
        return (
            <input
                key="search"
                ref={(input) => {
                    this.searchInput = input;
                }}
                value={this.state.query}
                placeholder="Search..."
                onChange={(e) => this.handleFilterChange(e)}
            />
        );
    }

    handleFilterChange(event: any) {
        if (event && event.target) {
            this.setState({
                query: event.target.value
            });
        }
    }

    getAllGroupsAsExpanded() {
        const groupsToInitializeAsExpanded: any = {};
        for (let i: number = 0; i < this.getIntentGroupsFromWidget(this.props.updatingWidget).length; i++) {
            groupsToInitializeAsExpanded[i] = true;
        }
        return groupsToInitializeAsExpanded;
    }

    getIntentActionGroup(intents: Intent[]) {
        return (
            <ReactTable
                key="intentActionGroup"
                data={intents}
                columns={this.getIntentSubTableColumns()}
                getTheadThProps={this.removeHideableHeaders}
                showPagination={false}
                getTrProps={this.makeRowsClickableProps}
                minRows={0}
                className="-striped -highlight"
            />
        );
    }

    // derived from https://github.com/tannerlinsley/react-table/issues/508#issuecomment-380392755
    removeHideableHeaders(state: any, rowInfo: any, column: any) {
        if (column.Header === "hideMe") {
            return { style: { display: "none" } }; // override style
        }
        return {};
    }

    getIntentGroupsFromWidget(widget: any): IntentGroup[] {
        const widgetIntents: IntentsGroupedByPermission = widget.intents;

        const permittedSendingGroups = this.getGroupsFromFormattedIntents(widgetIntents.send, "send");
        const allIntentGroups = this.getGroupsFromFormattedIntents(
            widgetIntents.receive,
            "receive",
            permittedSendingGroups
        );

        return allIntentGroups;
    }

    getGroupsFromFormattedIntents(
        actionGroups: CompressedIntentGroup[],
        direction: "send" | "receive",
        existingGroups?: IntentGroup[]
    ): IntentGroup[] {
        let intentGroups: IntentGroup[] = [];
        if (existingGroups) {
            intentGroups = existingGroups;
        }

        for (const actionGroup of actionGroups) {
            for (const dataType of actionGroup.dataTypes) {
                const intent: Intent = { action: actionGroup.action, dataType, send: false, receive: false };

                if (direction === "send" || direction === "receive") {
                    intent[direction] = true;
                }

                const existingGroup: IntentGroup | undefined = intentGroups.find((iG) => iG.action === intent.action);
                if (existingGroup) {
                    const existingIntent: Intent | undefined = existingGroup.intents.find(
                        (iG) => iG.dataType === intent.dataType
                    );
                    if (existingIntent) {
                        existingIntent.send = existingIntent.send || intent.send;
                        existingIntent.receive = existingIntent.receive || intent.receive;
                    } else {
                        existingGroup.intents.push(intent);
                    }
                } else {
                    intentGroups.push({ action: intent.action, intents: [intent] });
                }
            }
        }
        return intentGroups;
    }

    getIntentGroups(): any {
        return this.filterIntentGroups(this.state.allIntentGroups);
    }

    filterIntentGroups(intentGroups: IntentGroup[]): IntentGroup[] {
        if (this.state === undefined || this.state.query === "") {
            return intentGroups;
        }

        // leave in all actionGroups containing `term`, as well as all intents whose dataType includes `term`.
        // Remember it's {action:string, dataTypes:string[] }[],
        const filteredGroups: IntentGroup[] = intentGroups.filter((group) =>
            queryMatches(group.action, this.state.query)
        );

        for (const group of intentGroups) {
            if (listContainsObject(filteredGroups, group)) {
                continue;
            }
            const matchingIntents = group.intents.filter((intent) => queryMatches(intent.dataType, this.state.query));
            if (matchingIntents.length > 0) {
                filteredGroups.push({ action: group.action, intents: matchingIntents });
            }
        }
        return filteredGroups;
    }

    getMainTableColumns(): any {
        const title = this.props.updatingWidget ? this.props.updatingWidget.namespace : "Intents";

        return [
            {
                Header: () => this.getTableMainHeader(title),
                columns: [
                    {
                        Header: "hideMe",
                        expander: true,
                        width: 35
                    },
                    {
                        expander: true,
                        Header: () => <AlignedDiv message="Intent" alignment="left" />,
                        Expander: ({ isExpanded, ...rest }: any) => <div>{rest.original.action}</div>,
                        style: {
                            textAlign: "left"
                        }
                    },
                    {
                        Header: "Send",
                        width: this.smallBoolBoxWidth
                    },
                    {
                        Header: "Receive",
                        width: this.smallBoolBoxWidth
                    }
                ]
            }
        ];
    }

    getIntentSubTableColumns(): any {
        return [
            {
                Header: "hideMe",
                id: "dataType",
                accessor: (intent: Intent) => intent.dataType,
                style: {
                    paddingLeft: "4%",
                    textAlign: "left"
                }
            },
            {
                Header: "hideMe",
                id: "send",
                accessor: (intent: Intent) => dotCharacter(intent.send),
                width: this.smallBoolBoxWidth,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: "hideMe",
                id: "receive",
                accessor: (intent: Intent) => dotCharacter(intent.receive),
                width: this.smallBoolBoxWidth,
                style: {
                    textAlign: "center"
                }
            }
        ];
    }
}

const AlignedDiv: React.FC<{ message: React.ReactNode; alignment: "left" | "right" | "center" }> = (props) => {
    const { alignment, message } = props;

    return <div style={{ textAlign: alignment }}>{message}</div>;
};

function dotCharacter(returnDot: boolean): React.ReactNode {
    return returnDot ? <span>&#11044;</span> : <span />;
}

function listContainsObject(list: any[], obj: any): boolean {
    for (const o of list) {
        if (o === obj) return true;
    }
    return false;
}

function queryMatches(text: string, query: string): boolean {
    return text.includes(query);
}

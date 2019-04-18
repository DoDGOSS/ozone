import * as React from "react";

import { Button } from "@blueprintjs/core";
import ReactTable from "react-table";

import { GenericTable } from "../../../table/GenericTable";

import { Intent } from "../../../../../models/compat";
import { IntentDTO, IntentsDTO } from "../../../../../api/models/IntentDTO";

import { IntentDialog } from "./IntentDialog";

import * as styles from "../../Widgets.scss";

interface IntentGroup {
    action: string;
    intents: Intent[];
}

export interface IntentsPanelProps {
    updatingWidget: any;
    onChange: (intentGroups: IntentsDTO) => any;
}

interface IntentsPanelState {
    loading: boolean;
    allIntentGroups: IntentGroup[];
    expandedRows: { [Key: number]: boolean };
    dialogOpen: boolean;
    dialog: React.ReactNode;
    selectedIntent: Intent | undefined;
}

export class IntentsPanel extends React.Component<IntentsPanelProps, IntentsPanelState> {
    smallBoolBoxWidth = 100; // hard-coded pixel width for send/receive. Not good, but haven't found any way to use percentages

    constructor(props: IntentsPanelProps) {
        super(props);
        this.state = {
            loading: false,
            allIntentGroups: this.getIntentGroupsFromWidget(this.props.updatingWidget),
            expandedRows: this.getAllGroupsAsExpanded(),
            dialogOpen: false,
            dialog: null,
            selectedIntent: undefined
        };
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
        console.log('rerendering main table', this.state.expandedRows)
        return (
            <GenericTable
                items={this.state.allIntentGroups}
                getColumns={() => this.getMainTableColumns()}
                customFilter={this.filterIntentGroups}
                reactTableProps={{
                    expanderDefaults: {
                        sortable: true,
                        resizable: true,
                        filterable: false
                    },
                    SubComponent: (rowObject: any) => this.getIntentGroupSubTable(rowObject.original.intents),
                    defaultPageSize: 20,
                    minRows: 5,
                    onExpandedChange: (newExpanded: any, index: number, event: any) =>
                        {console.log(newExpanded, index, event); return this.handleRowExpanded(newExpanded, index, event)},
                    expanded: this.state.expandedRows
                }}
            />
        );
    }

    getIntentGroupSubTable(intents: Intent[]) {
        console.log('rerendering subtable', intents[0].action)
        return (
            <GenericTable
                items={intents}
                getColumns={() => this.getIntentSubTableColumns()}
                filterable={false}
                reactTableProps={{
                    showPagination: false,
                    minRows: 0
                }}
            />
        );
    }

    actionButtons(): any {
        return (
            <div>
                <Button text="Create" onClick={this.createIntent} />
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

    getIntentsInPartitionedFormat(): IntentsDTO {
        return {
            send: this.getIntentsWithPermission(this.state.allIntentGroups, "send"),
            receive: this.getIntentsWithPermission(this.state.allIntentGroups, "receive")
        };
    }

    getIntentsWithPermission(allIntentGroups: IntentGroup[], permission: "send" | "receive"): IntentDTO[] {
        const permitted: IntentDTO[] = [];
        for (const intentGroup of allIntentGroups) {
            const permittedIntents: Intent[] = intentGroup.intents.filter((intent) => intent[permission]);
            if (permittedIntents.length > 0) {
                const newAction: IntentDTO = { action: intentGroup.action, dataTypes: [] };
                for (const pIntent of permittedIntents) {
                    newAction.dataTypes.push(pIntent.dataType);
                }
                permitted.push(newAction);
            }
        }
        return permitted;
    }

    /*
     * Must be done manually, otherwise sub-areas collapse on filter, sort, and tab-change.
     */
    handleRowExpanded(newExpanded: any, index: number, event: any): void {
        // clean newExpanded first. Don't know why it comes with {} instead of true, but it breaks if you keep it like that.
        for (let i = 0; i < newExpanded.length; i++) {
            if (newExpanded[i] === {}) {
                newExpanded[i] = true;
            }
        }
        console.log(newExpanded)
        this.setState({
            expandedRows: newExpanded
        });
    }

    getAllGroupsAsExpanded() {
        const groupsToInitializeAsExpanded: any = {};
        for (let i: number = 0; i < this.getIntentGroupsFromWidget(this.props.updatingWidget).length; i++) {
            groupsToInitializeAsExpanded[i] = true;
        }
        return groupsToInitializeAsExpanded;
    }

    getIntentGroupsFromWidget(widget: any): IntentGroup[] {
        const widgetIntents: IntentsDTO = widget.intents;

        const permittedSendingGroups = this.getGroupsFromFormattedIntents(widgetIntents.send, "send");
        const allIntentGroups = this.getGroupsFromFormattedIntents(
            widgetIntents.receive,
            "receive",
            permittedSendingGroups
        );

        return allIntentGroups;
    }

    getGroupsFromFormattedIntents(
        actionGroups: IntentDTO[],
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

    filterIntentGroups(
        intentGroups: IntentGroup[],
        query: string,
        queryMatches: (msg: string, query: string) => boolean
    ): IntentGroup[] {
        // leave in all actionGroups containing `term`, as well as all intents whose dataType includes `term`.
        // Remember it's {action:string, dataTypes:string[] }[],
        const filteredGroups: IntentGroup[] = intentGroups.filter((group) => queryMatches(group.action, query));

        for (const group of intentGroups) {
            if (listContainsObject(filteredGroups, group)) {
                continue;
            }
            const matchingIntents = group.intents.filter((intent) => queryMatches(intent.dataType, query));
            if (matchingIntents.length > 0) {
                filteredGroups.push({ action: group.action, intents: matchingIntents });
            }
        }
        return filteredGroups;
    }

    getMainTableColumns(): any {
        const title1 = this.props.updatingWidget ? this.props.updatingWidget.displayName : "Intents";

        return [
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

import * as React from "react";

import { Button, ButtonGroup, Divider, Intent as bpIntent } from "@blueprintjs/core";
import ReactTable from "react-table";

import { GenericTable } from "../../../table/GenericTable";
import { DeleteButton, EditButton } from "../../../table/TableButtons";
import { showConfirmationDialog } from "../../../../confirmation-dialog/InPlaceConfirmationDialog";

import { Intent } from "../../../../../models/compat";
import { IntentDTO, IntentsDTO } from "../../../../../api/models/IntentDTO";
import { WidgetUpdateRequest } from "../../../../../api/models/WidgetDTO";

import { IntentDialog } from "./IntentDialog";
import { mainStore } from "../../../../../stores/MainStore";
import { classNames } from "../../../../../utility";

import * as styles from "../../Widgets.scss";

interface IntentGroup {
    action: string;
    intents: Intent[];
}

export interface IntentsPanelProps {
    updatingWidget: WidgetUpdateRequest;
    onChange: (intentGroups: IntentsDTO) => any;
}

interface IntentsPanelState {
    loading: boolean;
    pageSize: number;
    allIntentGroups: IntentGroup[];
    expandedRows: { [Key: number]: boolean };
    dialog: React.ReactNode;
}

export class IntentsPanel extends React.Component<IntentsPanelProps, IntentsPanelState> {
    smallBoolBoxWidth = 100; // hard-coded pixel width for send/receive. Not good, but haven't found any way to use percentages
    buttonAreaWidth = 2 * this.smallBoolBoxWidth;

    constructor(props: IntentsPanelProps) {
        super(props);
        this.state = {
            loading: false,
            pageSize: 10,
            allIntentGroups: this.getIntentGroupsFromWidget(this.props.updatingWidget),
            expandedRows: this.getAllGroupsAsExpanded(),
            dialog: undefined
        };
    }

    render() {
        return (
            <div className={styles.table}>
                {this.state.dialog}
                {this.mainTable()}
                <Button text="Create" onClick={() => this.createIntent()} />
            </div>
        );
    }

    mainTable(): any {
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
                    onExpandedChange: (newExpanded: any, indices: number[], event: any) => {
                        return this.handleRowExpanded(newExpanded, indices, event);
                    },
                    expanded: this.state.expandedRows
                }}
            />
        );
    }

    getIntentGroupSubTable(intents: Intent[]) {
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

    /*
     * Must be done manually, otherwise sub-areas collapse on filter, sort, and tab-change.
     */
    handleRowExpanded(newExpanded: any, indices: number[], event: any): void {
        // clean newExpanded first. Don't know why it comes with {} instead of true, but it breaks if you keep it like that.
        for (const row in newExpanded) {
            if (newExpanded.hasOwnProperty(row)) {
                if (newExpanded[row] !== false) {
                    newExpanded[row] = true;
                }
            }
        }
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

    createIntent(): void {
        this.setState({
            dialog: this.createIntentDialog()
        });
    }

    editIntent(intent: Intent): void {
        this.setState({
            dialog: this.editIntentDialog(intent)
        });
    }

    createIntentDialog() {
        return (
            <IntentDialog
                isOpen={true}
                onClose={() => this.closeDialog()}
                onSubmit={(newIntent: Intent) => this.onIntentFormSubmit(newIntent)}
            />
        );
    }

    editIntentDialog(originalIntent: Intent) {
        return (
            <IntentDialog
                isOpen={true}
                onClose={() => this.closeDialog()}
                intentToEdit={originalIntent}
                onSubmit={(newIntent: Intent) => this.onIntentFormSubmit(newIntent, originalIntent)}
            />
        );
    }

    closeDialog(): void {
        this.setState({
            dialog: undefined
        });
    }

    onIntentFormSubmit(newIntent: Intent, originalIntent?: Intent): void {
        if (originalIntent) {
            this.updateIntent(originalIntent, newIntent);
        } else {
            this.addIntent(newIntent);
        }
        this.saveIntents();
    }

    updateIntent(originalIntent: Intent, intent: Intent): void {
        this.removeIntent(originalIntent);
        this.addIntent(intent);
    }

    deleteIntentAndSave(intent: Intent): void {
        this.removeIntent(intent);
        this.saveIntents();
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
        const formattedIntents = this.intentGroupsToIntentsDTO();
        this.props.onChange(formattedIntents);
    }

    intentGroupsToIntentsDTO(): IntentsDTO {
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

    getIntentGroupsFromWidget(widget: WidgetUpdateRequest): IntentGroup[] {
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
        queryMatches: (text: string, query: string) => boolean
    ): IntentGroup[] {
        if (query === "") {
            return intentGroups;
        }

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
        return [
            {
                Header: "hideMe",
                expander: true,
                width: 35
            },
            {
                Header: () => <AlignedDiv message="Intent" alignment="left" />,
                // perhaps add a onClick function that calls the expander, so you can click the row instead of jsut the arrow.
                style: {
                    textAlign: "left"
                },
                id: "action",
                accessor: (intentGroup: IntentGroup) => intentGroup.action
            },
            {
                Header: "Send",
                id: "send",
                sortable: false,
                resizable: false,
                width: this.smallBoolBoxWidth
            },
            {
                Header: "Receive",
                id: "receive",
                sortable: false,
                resizable: false,
                width: this.smallBoolBoxWidth
            },
            {
                Header: "Actions",
                sortable: false,
                resizable: false,
                Cell: () => <div />,
                width: this.buttonAreaWidth
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
            },
            { Header: "hideMe", Cell: this.intentButtons, width: this.buttonAreaWidth }
        ];
    }

    intentButtons = (row: { original: Intent }) => {
        return (
            <div>
                <ButtonGroup>
                    <EditButton
                        onClick={() => {
                            this.editIntent(row.original);
                        }}
                    />
                    <Divider />
                    <DeleteButton onClick={() => this.confirmAndDeleteIntent(row.original)} />
                </ButtonGroup>
            </div>
        );
    };

    confirmAndDeleteIntent(intentToDelete: Intent): void {
        showConfirmationDialog({
            title: "Warning",
            message:
                "This action will permanently delete intent {action: " +
                intentToDelete.action +
                ", dataType: " +
                intentToDelete.action +
                ", send: " +
                intentToDelete.send +
                ", receive: " +
                intentToDelete.receive +
                " from the widget " +
                this.props.updatingWidget.displayName,
            onConfirm: () => this.deleteIntentAndSave(intentToDelete)
        });
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

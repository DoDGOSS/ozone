import * as React from "react";

import { Button, ButtonGroup, Divider, Intent as bpIntent } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../../generic-table/GenericTable";
import { showConfirmationDialog } from "../../../../confirmation-dialog/showConfirmationDialog";

import { Intent } from "../../../../../models/compat";
import { IntentDTO, IntentsDTO } from "../../../../../api/models/IntentDTO";
import { WidgetDTO } from "../../../../../api/models/WidgetDTO";

import { IntentDialog } from "./IntentDialog";

import * as styles from "../../Widgets.scss";

interface IntentGroup {
    action: string;
    intents: Intent[];
}

export interface IntentsPanelProps {
    updatingWidget: WidgetDTO;
    onIntentsChange: (intentGroups: IntentsDTO) => any;
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
                tableProps={{
                    data: this.state.allIntentGroups,
                    dataTree: true,
                    dataTreeStartExpanded: [true, false],
                    dataTreeChildField: "intents",
                    paginationSize: 20,
                    responsiveLayout: false
                }}
            />
        );
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
        this.props.onIntentsChange(formattedIntents);
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

    getIntentGroupsFromWidget(widget: WidgetDTO): IntentGroup[] {
        const widgetIntents: IntentsDTO = widget.value.intents;

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

    filterIntentGroups = (
        intentGroups: IntentGroup[],
        query: string,
        queryMatches: (text: string, query: string) => boolean
    ): IntentGroup[] => {
        if (query === "") {
            return intentGroups;
        }

        // leave in all actionGroups containing `term`, as well as all intents whose dataType includes `term`.
        // Remember it's {action:string, dataTypes:string[] }[],
        const filteredGroups: IntentGroup[] = intentGroups.filter((group) => queryMatches(group.action, query));

        for (const group of intentGroups) {
            if (filteredGroups.findIndex((grp: IntentGroup) => grp === group) > -1) {
                continue;
            }
            const matchingIntents = group.intents.filter((intent) => queryMatches(intent.dataType, query));
            if (matchingIntents.length > 0) {
                filteredGroups.push({ action: group.action, intents: matchingIntents });
            }
        }
        return filteredGroups;
    };

    getMainTableColumns(): any {
        return [
            {
                title: "",
                width: 35,
                headerSort: false,
                align: "center"
            },
            {
                title: "Intent",
                align: "left",
                field: "action",
                headerSort: true,
                width: 280,
                formatter: (row: any) => {
                    const data: any = row.cell._cell.row.getData();
                    return data.hasOwnProperty("intents") ? (
                        <strong>{data.action}</strong>
                    ) : (
                        <div style={{ marginLeft: "15px" }}>{data.dataType}</div>
                    );
                }
            },
            {
                title: "Send",
                field: "send",
                headerSort: false,
                resizable: false,
                formatter: (row: any) => {
                    const data: any = row.cell._cell.row.data;
                    return dotCharacter(data.send);
                },
                align: "left",
                width: this.smallBoolBoxWidth
            },
            {
                title: "Receive",
                field: "receive",
                headerSort: false,
                resizable: false,
                formatter: (row: any) => {
                    const data: any = row.cell._cell.row.data;
                    return dotCharacter(data.receive);
                },
                align: "left",
                width: this.smallBoolBoxWidth
            },
            {
                title: "",
                formatter: (row: any) => {
                    const data: any = row.cell._cell.row.getData();
                    return !data.hasOwnProperty("intents") ? this.intentButtons(row) : <div />;
                },
                align: "center",
                headerSort: false,
                width: this.buttonAreaWidth
            }
        ] as ColumnTabulator[];
    }

    intentButtons = (row: any) => {
        const data: Intent = row.cell._cell.row.data;
        return (
            <div>
                <ButtonGroup>
                    <Button
                        data-element-id="widget-admin-intent-edit-button"
                        data-widget-title={data.action + " " + data.dataType}
                        text="Edit"
                        intent={bpIntent.PRIMARY}
                        icon="edit"
                        small={true}
                        onClick={() => {
                            this.editIntent(data);
                        }}
                    />
                    <Divider />
                    <Button
                        data-element-id="widget-admin-intent-remove-button"
                        data-widget-title={data.action + " " + data.dataType}
                        text={"Remove"}
                        intent={bpIntent.DANGER}
                        icon="trash"
                        small={true}
                        onClick={() => this.confirmAndDeleteIntent(data)}
                    />
                </ButtonGroup>
            </div>
        );
    };

    confirmAndDeleteIntent(intentToDelete: Intent): void {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will permanently delete intent {",
                { text: intentToDelete.action, style: "bold" },
                ": ",
                { text: intentToDelete.action, style: "bold" },
                "} from widget ",
                { text: this.props.updatingWidget.value.namespace, style: "bold" }
            ],
            onConfirm: () => this.deleteIntentAndSave(intentToDelete)
        });
    }
}

const AlignedDiv: React.FC<{ message: React.ReactNode; alignment: "left" | "right" | "center" }> = (props) => {
    const { alignment, message } = props;

    return <div style={{ textAlign: alignment }}>{message}</div>;
};

function dotCharacter(returnDot: boolean): React.ReactNode {
    return returnDot ? <span style={{ textAlign: "center" }}>&#11044;</span> : <span />;
}

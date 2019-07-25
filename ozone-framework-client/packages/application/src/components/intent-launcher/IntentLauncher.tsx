import styles from "./index.module.scss";

import React, { useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Classes, Dialog, Intent as BP3Intent } from "@blueprintjs/core";

import { dashboardStore } from "../../stores/DashboardStore";
import { desktopStore } from "../../stores/DesktopStore";
import { intentStore } from "../../stores/IntentStore";
import { mainStore } from "../../stores/MainStore";
import { classNames, isStrictlyEqual, Predicate, some, values } from "../../utility";

import { useBehavior, useCheckboxValue, useStore, useStoreSelector } from "../../hooks";
import { UserWidget } from "../../models/UserWidget";
import { WidgetInstance } from "../../models/WidgetInstance";
import { selectUserWidgetIds, selectWidgetInstanceIds } from "../../stores/immutable-model";
import { Intent, IntentInstance } from "../../models/Intent";
import { ActiveInstancesList, AvailableWidgetsList } from "./internal";

export const IntentLauncher: React.FC = () => {
    const themeClass = useBehavior(mainStore.themeClass);

    const { dialog } = useStore(intentStore);
    const intent = dialog.isVisible ? dialog.intent : undefined;
    const intentAction = (intent && intent.action) || "";
    const intentDataType = (intent && intent.dataType) || "";

    const widgetInstanceIds = useStoreSelector(desktopStore(), selectWidgetInstanceIds);
    const userWidgetIds = useStoreSelector(desktopStore(), selectUserWidgetIds);

    const userState = useBehavior(dashboardStore.userDashboards);
    const currentDashboard = useBehavior(dashboardStore.currentDashboard);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [remember, onRememberChange] = useCheckboxValue(false);

    const onClose = useCallback(() => {
        if (dialog.isVisible) {
            dialog.onClosed();
        }
        intentStore.hideDialog();
    }, [dialog]);

    const onSelected = useCallback(() => {
        if (dialog.isVisible) {
            dialog.onSelected(selectedIds, remember);
        }
        intentStore.hideDialog();
    }, [dialog, selectedIds, remember]);

    const activeWidgetInstances = useMemo(() => {
        return currentDashboard.getWidgets().filter(canReceiveIntent(intent));
    }, [currentDashboard, intent, widgetInstanceIds]);

    const availableUserWidgets = useMemo(() => {
        return values(userState.widgets).filter(canReceiveIntent(intent));
    }, [userState, intent, userWidgetIds]);

    const noReceivers = activeWidgetInstances.length === 0 && availableUserWidgets.length === 0;

    return (
        <Dialog
            className={classNames(styles.dialog, themeClass)}
            isOpen={dialog.isVisible}
            onClose={onClose}
            title="Widget Intent Selection"
            icon="widget"
        >
            <div className={Classes.DIALOG_BODY}>
                <div>
                    {intentAction} - {intentDataType}
                </div>
                {noReceivers && (
                    <div className={styles.zeroState}>No widgets are registered that may receive this intent.</div>
                )}
                {!noReceivers && (
                    <>
                        <ActiveInstancesList
                            instances={activeWidgetInstances}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                        />
                        <AvailableWidgetsList widgets={availableUserWidgets} />
                        <Checkbox
                            large={true}
                            label="Remember this decision"
                            checked={remember}
                            onChange={onRememberChange}
                        />
                    </>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        text="OK"
                        onClick={onSelected}
                        disabled={selectedIds.length === 0}
                        intent={BP3Intent.SUCCESS}
                        rightIcon="tick"
                    />
                    <Button text="Cancel" onClick={onClose} rightIcon="cross" />
                </div>
            </div>
        </Dialog>
    );
};

function canReceiveIntent(intent?: IntentInstance): Predicate<WidgetInstance | UserWidget> {
    return (widget: WidgetInstance | UserWidget) => {
        if (!intent) return false;

        const userWidget = widget instanceof UserWidget ? widget : widget.userWidget;
        return some(userWidget.widget.intents.receive, matchesIntent(intent));
    };
}

function matchesIntent(instance: IntentInstance): Predicate<Intent> {
    return (match: Intent) => {
        if (instance.action !== match.action) return false;
        return some(match.dataTypes, isStrictlyEqual(instance.dataType));
    };
}

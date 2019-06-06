import React, { useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, Intent } from "@blueprintjs/core";

import { classNames } from "../../utility";
import { mainStore } from "../../stores/MainStore";

import "./custom-style.scss";

interface InvalidUrlListProps {
    items: { type: "stack" | "dashboard" | "widget"; name: string; url: string }[];
    closeMe: () => void;
}

/**
 * See StoreMetaService for use
 */
export const InvalidUrlList: React.FC<InvalidUrlListProps> = (props: InvalidUrlListProps) => {
    const themeClass = useBehavior(mainStore.themeClass);
    const [detailed, setDetailLevel] = useState(false);
    return (
        <div className={classNames(themeClass, Classes.DIALOG)}>
            <div className={Classes.DIALOG_HEADER}>Error: non-fully-qualified or local urls in stack.</div>
            <div className={Classes.DIALOG_BODY}>
                {!detailed && (
                    <div>
                        <div>All Urls in stacks, dashboards, and widgets must be fully-qualified.</div>
                        <br />
                        <div>(I.e., urls must look like `http(s)://[something].[something]`)</div>
                        <br />
                        <Button onClick={() => setDetailLevel(true)} id={"show-detail-button"}>
                            Show Violations
                        </Button>
                    </div>
                )}
                {detailed && (
                    <div>
                        <div>All urls must have the form of `http(s)://[something].[something]`.</div>
                        <br />
                        <div>The following items have local or non-fully-qualified urls:</div>
                        <br />
                        <div className={"scrollable"}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>
                                            <h4>Item name</h4>
                                        </th>
                                        <th>
                                            <h4>Item Type</h4>
                                        </th>
                                        <th>
                                            <h4>Incomplete URL</h4>
                                        </th>
                                    </tr>
                                    {props.items.map((infractingItem, index) => (
                                        <tr key={infractingItem.name + infractingItem.type + infractingItem.url}>
                                            <th>{infractingItem.name}</th>
                                            <th>{infractingItem.type}</th>
                                            <th>{infractingItem.url}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <br />
                    </div>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <span>Fix or remove all incomplete/local URLs, and try again.</span>
                    <Button
                        onClick={() => {
                            props.closeMe();
                        }}
                        data-element-id="close-unqualified-item-notification"
                    >
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
};

import styles from "../index.module.scss";

import React from "react";

import { WidgetInstance } from "../../../models/WidgetInstance";
import { append, includes, omit } from "../../../utility";

import { WidgetInstanceTile } from "../../widget-tile";

export interface ActiveInstancesListProps {
    instances: WidgetInstance[];
    selectedIds: string[];
    setSelectedIds: (value: string[]) => void;
}

export const ActiveInstancesList: React.FC<ActiveInstancesListProps> = (props) => {
    const { instances, selectedIds, setSelectedIds } = props;

    return (
        <div>
            <div>Active Widgets</div>
            <div className={styles.tileContainer}>
                {instances.map((instance) => {
                    const isSelected = includes(selectedIds, instance.id);
                    return (
                        <WidgetInstanceTile
                            key={instance.id}
                            widgetInstance={instance}
                            isSelected={isSelected}
                            onClick={() => {
                                if (isSelected) {
                                    setSelectedIds(omit(selectedIds, instance.id));
                                } else {
                                    setSelectedIds(append(selectedIds, instance.id));
                                }
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

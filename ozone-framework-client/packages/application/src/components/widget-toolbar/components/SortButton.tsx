import React from "react";
import { Button } from "@blueprintjs/core";

export type SortOrder = "asc" | "dsc";

export interface SortButtonProps {
    order: SortOrder;
    onClick: (order: SortOrder) => void;
}

const _SortButton: React.FC<SortButtonProps> = ({ order, onClick }) => {
    const icon = order === "asc" ? "sort-alphabetical" : "sort-alphabetical-desc";

    return (
        <Button
            minimal
            icon={icon}
            onClick={() => onClick(order === "asc" ? "dsc" : "asc")}
            data-element-id="widget-sort"
        />
    );
};

export const SortButton = React.memo(_SortButton);

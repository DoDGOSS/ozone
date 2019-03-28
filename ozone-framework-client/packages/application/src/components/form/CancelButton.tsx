import * as styles from "./index.scss";

import * as React from "react";
import { Button } from "@blueprintjs/core";

import { classNames } from "../../utility";

export interface CancelButtonProps {
    onClick: () => void;
    className?: string;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ onClick, className }) => (
    <Button
        className={classNames(styles.cancelButton, className)}
        text="Back"
        icon="undo"
        small={true}
        onClick={onClick}
    />
);

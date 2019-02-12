import * as styles from "./Form.scss";

import * as React from "react";
import { Button } from "@blueprintjs/core";

import { classNames } from "../util";


export interface CancelButtonProps {
    onClick: () => void;
    className?: string;
}


export const CancelButton: React.FunctionComponent<CancelButtonProps> =
    ({ onClick, className }) => (
        <Button
            className={classNames(styles.cancelButton, className)}
            text="Back"
            icon="undo"
            small={true}
            onClick={onClick}
        />
    );

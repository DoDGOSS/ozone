import * as React from "react";

import { Callout, Intent } from "@blueprintjs/core";

import * as styles from "./index.scss";

export interface FormErrorProps {
    message: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => (
    <Callout title="Error" data-element-id="form-error-callout" intent={Intent.DANGER} className={styles.errorCallout}>
        {message}
    </Callout>
);

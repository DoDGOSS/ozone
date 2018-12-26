import * as styles from "./form.scss";

import * as React from "react";
import { Callout, Intent } from "@blueprintjs/core";


export interface FormErrorProps {
    message: string;
}


export const FormError: React.FunctionComponent<FormErrorProps> = ({message}) => (
    <Callout title="Error"
             data-element-id="form-error-callout"
             intent={Intent.DANGER}
             className={styles.errorCallout}>
        {message}
    </Callout>
);

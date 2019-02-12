import * as styles from "./Form.scss";

import * as React from "react";
import { connect, FormikContext } from "formik";
import { Button } from "@blueprintjs/core";

import { classNames } from "../util";


interface SubmitButtonProps {
    className?: string;
}

const _SubmitButton: React.FunctionComponent<SubmitButtonProps & { formik: FormikContext<any> }> = ({ className, formik }) => {
    const { dirty, isValid, isSubmitting } = formik;

    return (
        <Button className={classNames(styles.submitButton, className)}
                type="submit"
                text="Submit"
                intent="primary"
                data-element-id="form-submit-button"
                disabled={isSubmitting || !(dirty && isValid)}/>
    );
};

_SubmitButton.displayName = "SubmitButton";


export const SubmitButton = connect<SubmitButtonProps>(_SubmitButton);

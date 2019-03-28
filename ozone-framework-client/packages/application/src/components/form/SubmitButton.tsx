import * as React from "react";

import { connect, FormikContext } from "formik";

import { Button } from "@blueprintjs/core";

import { classNames } from "../../utility";

import * as styles from "./index.scss";

interface SubmitButtonProps {
    className?: string;
}

const _SubmitButton: React.FC<SubmitButtonProps & { formik: FormikContext<any> }> = (props) => {
    const { dirty, isValid, isSubmitting } = props.formik;

    return (
        <Button
            className={classNames(styles.submitButton, props.className)}
            type="submit"
            text="Submit"
            intent="primary"
            data-element-id="form-submit-button"
            disabled={isSubmitting || !(dirty && isValid)}
        />
    );
};

export const SubmitButton = connect<SubmitButtonProps>(_SubmitButton);

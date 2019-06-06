import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";
import { Button, Intent, Position, Toaster } from "@blueprintjs/core";

import { FormError, TextField } from "../../../form";
import { cleanNullableProp } from "../../../../utility";
import { StackCreateRequest, StackDTO, StackUpdateRequest } from "../../../../api/models/StackDTO";

import { assetUrl } from "../../../../environment";

import * as styles from "../Widgets.scss";

interface StackEditProps {
    saveStack: (data: StackCreateRequest | StackUpdateRequest) => Promise<boolean>;
    stack: StackDTO | undefined;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export const StackPropertiesPanel: React.FC<StackEditProps> = ({ saveStack, stack }) => (
    <Formik
        initialValues={getInitialValues(stack)}
        validationSchema={EditStackSchema}
        onSubmit={async (
            values: StackCreateRequest | StackUpdateRequest,
            actions: FormikActions<StackCreateRequest | StackUpdateRequest>
        ) => {
            const isSuccess = await saveStack(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);

            if (isSuccess) {
                OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
                actions.resetForm(values);
            } else {
                OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
            }
        }}
    >
        {(formik: FormikProps<StackCreateRequest | StackUpdateRequest>) => (
            <div data-element-id="stack-admin-widget-edit-form">
                <Form className={styles.form}>
                    <div className={styles.formBody}>
                        {" "}
                        <div className={styles.formIcon}>
                            <img width="60px" src={assetUrl(formik.values.imageUrl)} />
                        </div>
                        <TextField name="name" label="Name" labelInfo="(required)" />
                        <TextField name="imageUrl" label="Icon Url" />
                        <TextField name="description" label="Description" />
                        {formik.status && formik.status.error && <FormError message={formik.status.error} />}
                    </div>

                    <div className={styles.buttonBar} data-element-id="stack-admin-widget-edit-submit-button">
                        <Button
                            type="submit"
                            text="Apply"
                            data-element-id="form-submit-button"
                            disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}
                        />
                    </div>
                </Form>
            </div>
        )}
    </Formik>
);

function getInitialValues(stack: StackDTO | undefined): StackCreateRequest | StackUpdateRequest {
    if (stack) {
        return convertDTOtoUpdateRequest(stack);
    } else {
        return {
            name: "",
            imageUrl: "",
            description: "",
            stackContext: ""
        };
    }
}
function convertDTOtoUpdateRequest(stack: StackDTO): StackUpdateRequest {
    return {
        id: stack.id,
        name: stack.name,
        imageUrl: cleanNullableProp(stack.imageUrl),
        stackContext: stack.stackContext,
        description: cleanNullableProp(stack.description)
    };
}

const EditStackSchema = object().shape({
    name: string().required("Required"),
    imageUrl: string().nullable(),
    description: string().nullable()
});

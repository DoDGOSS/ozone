import styles from "../Widgets.scss";

import React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import * as yup from "yup";
import { Button, Intent, Position, Toaster } from "@blueprintjs/core";

import {
    GroupCreateRequest,
    GroupDTO,
    GroupUpdateRequest,
    isAutoManaged,
    isDefaultGroup
} from "../../../../api/models/GroupDTO";
import { cleanNullableProp } from "../../../../utility";
import { CheckBox, FormError, TextField } from "../../../form";

interface GroupEditProps {
    onSave: (data: GroupCreateRequest | GroupUpdateRequest) => Promise<boolean>;
    group: GroupDTO | undefined;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export const GroupPropertiesPanel: React.FC<GroupEditProps> = ({ onSave, group }) => (
    <Formik
        initialValues={getInitialValues(group)}
        validationSchema={EditGroupSchema}
        onSubmit={async (
            values: GroupCreateRequest | GroupUpdateRequest,
            actions: FormikActions<GroupCreateRequest | GroupUpdateRequest>
        ) => {
            const isSuccess = await onSave(values);
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
        {(formik: FormikProps<GroupCreateRequest | GroupUpdateRequest>) => (
            <div data-element-id="group-admin-widget-edit-form">
                <Form className={styles.form}>
                    <div className={styles.formBody}>
                        {" "}
                        <TextField name="name" label="Name" labelInfo="(required)" disabled={isDefaultGroup(group)} />
                        <TextField
                            name="displayName"
                            label="Display Name"
                            labelInfo="(required)"
                            disabled={isDefaultGroup(group)}
                        />
                        <TextField name="description" label="Description" labelInfo="(required)" />
                        <CheckBox
                            name="active"
                            label="Active"
                            text="True"
                            defaultChecked={group !== undefined && group.status === "active"}
                            disabled={isDefaultGroup(group)}
                        />
                        <CheckBox
                            name="automatic"
                            label="User Management"
                            text="Automatic"
                            disabled={isAutoManaged(group)}
                            defaultChecked={group !== undefined && group.automatic}
                        />
                        {formik.status && formik.status.error && <FormError message={formik.status.error} />}
                    </div>

                    <div className={styles.buttonBar} data-element-id="group-admin-widget-edit-submit-button">
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

function getInitialValues(group: GroupDTO | undefined): GroupCreateRequest | GroupUpdateRequest {
    if (group) {
        return convertDTOtoUpdateRequest(group);
    } else {
        return {
            name: "",
            displayName: "",
            description: "",
            email: "",
            automatic: false,
            status: "active",
            active: true
        };
    }
}
function convertDTOtoUpdateRequest(group: GroupDTO): GroupUpdateRequest {
    return {
        id: group.id,
        name: group.name,
        displayName: cleanNullableProp(group.displayName),
        description: cleanNullableProp(group.description),
        email: cleanNullableProp(group.email),
        automatic: group.automatic,
        status: group.status,
        active: group.status === "active"
    };
}

const EditGroupSchema = yup.object().shape({
    name: yup.string().required("Required"),
    displayName: yup.string().required("Required"),
    description: yup.string().required("Required"),
    active: yup.string(),
    automatic: yup.string()
});

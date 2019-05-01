import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";
import { Button } from "@blueprintjs/core";

import { CheckBox, FormError, TextField } from "../../../form";
import { cleanNullableProp } from "../../../../utility";
import { GroupCreateRequest, GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";

import * as styles from "../Widgets.scss";

interface GroupEditProps {
    onSave: (data: GroupCreateRequest | GroupUpdateRequest) => Promise<boolean>;
    group: GroupDTO | undefined;
}

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
                actions.resetForm(values);
            }
        }}
    >
        {(formik: FormikProps<GroupCreateRequest | GroupUpdateRequest>) => (
            <div data-element-id="group-admin-widget-edit-form">
                <Form className={styles.form}>
                    <div className={styles.formBody}>
                        {" "}
                        <TextField name="name" label="Name" labelInfo="(required)" />
                        <TextField name="displayName" label="Display Name" labelInfo="(required)" />
                        <TextField name="description" label="Description" labelInfo="(required)" />
                        <CheckBox
                            name="active"
                            label="Active"
                            text="True"
                            defaultChecked={group !== undefined && group.status === "active"}
                        />
                        <CheckBox
                            name="automatic"
                            label="User Management"
                            text="Automatic"
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

const EditGroupSchema = object().shape({
    name: string().required("Required"),

    displayName: string().required("Required"),

    description: string().required("Required"),

    active: string(),

    userManagement: string()
});

import * as styles from "./GroupCreateForm.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { GroupUpdateRequest } from "../../../../api";
import { CancelButton, CheckBox, FormError, SubmitButton, TextField } from "../../../form";


interface GroupEditProps {
    onSubmit: (data: GroupUpdateRequest) => Promise<boolean>;
    onCancel: () => void;
    group?: any;
}

export const GroupEditForm: React.FunctionComponent<GroupEditProps> =
    ({ onSubmit, onCancel, group }) => (
        
        <Formik
            initialValues={ group }
            validationSchema={EditGroupSchema}
            onSubmit={async (values: GroupUpdateRequest, actions: FormikActions<GroupUpdateRequest>) => {
                const isSuccess = await onSubmit(values);
                actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
                actions.setSubmitting(false);
            }}
        >
            {(formik: FormikProps<GroupUpdateRequest>) => (
                <div data-element-id='group-admin-widget-edit-form'>
                    <Form className={styles.form}>
                        <TextField name="name" label="Name" labelInfo="(required)"/>
                        <TextField name="displayName" label="Display Name" labelInfo="(required)"/>
                        <TextField name="description" label="Description" labelInfo="(required)"/>
                        <CheckBox name="active" label="Active" text="True" defaultChecked={group.status === 'active'}/>
                        <CheckBox name="automatic" label="User Management" text="Automatic" defaultChecked={group.automatic}/>

                        {formik.status && formik.status.error && <FormError message={formik.status.error}/>}

                        <div className={styles.buttonBar} data-element-id='group-admin-widget-edit-submit-button'>
                            <CancelButton className={styles.cancelButton} onClick={onCancel}/>
                            <SubmitButton className={styles.submitButton}/>
                        </div>                    
                    </Form>
                </div>
            )}
        </Formik>
    );


const EditGroupSchema = object().shape({
    name: string().required("Required"),

    displayName: string().required("Required"),

    description: string().required("Required"),

    active: string(),

    userManagement: string()
});


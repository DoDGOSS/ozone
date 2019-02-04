import * as styles from "../Widgets.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { GroupUpdateRequest } from "../../../../api";
import { CheckBox, FormError, TextField } from "../../../form";
import { Button } from '@blueprintjs/core';


interface GroupEditProps {
    onUpdate: (data: GroupUpdateRequest) => Promise<boolean>;
    group: any;
}

export const GroupEditForm: React.FunctionComponent<GroupEditProps> =
    ({ onUpdate, group }) => (
        
        <Formik
            initialValues={ group }
            validationSchema={EditGroupSchema}
            onSubmit={async (values: GroupUpdateRequest, actions: FormikActions<GroupUpdateRequest>) => {
                const isSuccess = await onUpdate(values);
                actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
                actions.setSubmitting(false);

                if (isSuccess) {
                    actions.resetForm(values);
                }
            }}
        >
            {(formik: FormikProps<GroupUpdateRequest>) => (
                <div data-element-id='group-admin-widget-edit-form'>
                    <Form className={styles.form}>
                        <div className={styles.formBody}>                        <TextField name="name" label="Name" labelInfo="(required)"/>
                            <TextField name="displayName" label="Display Name" labelInfo="(required)"/>
                            <TextField name="description" label="Description" labelInfo="(required)"/>
                            <CheckBox name="active" label="Active" text="True" defaultChecked={group.status === 'active'}/>
                            <CheckBox name="automatic" label="User Management" text="Automatic" defaultChecked={group.automatic}/>

                            {formik.status && formik.status.error && <FormError message={formik.status.error}/>}
                        </div>

                        <div className={styles.buttonBar} data-element-id='group-admin-widget-edit-submit-button'>
                            <Button
                                type="submit"
                                text="Apply"
                                data-element-id="form-submit-button"
                                disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}/>
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


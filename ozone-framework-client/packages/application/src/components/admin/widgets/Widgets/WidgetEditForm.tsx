import * as styles from "../Widgets.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { WidgetDTO, WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";
import { CheckBox, FormError, HiddenField, TextField } from "../../../form";
import { Button } from "@blueprintjs/core";
import { WidgetTypeReference } from '../../../../api/models/WidgetTypeDTO';
import { renderWidgetType, WidgetTypeSelect } from './WidgetCreateForm';

interface WidgetEditProps {
    onUpdate: (data: WidgetUpdateRequest) => Promise<boolean>;
    widget: any;
    items: WidgetTypeReference[];
}

export const WidgetEditForm: React.FunctionComponent<WidgetEditProps> = ({ onUpdate, widget, items }) => (
    <Formik
        initialValues={{
            id: widget.id,
            displayName: widget.value.namespace,
            widgetVersion: widget.value.widgetVersion,
            description: widget.value.description,
            widgetUrl: widget.value.url,
            imageUrlSmall: widget.value.smallIconUrl,
            imageUrlMedium: widget.value.mediumIconUrl,
            width: widget.value.width,
            height: widget.value.height,
            widgetGuid: widget.id,
            universalName: widget.value.universalName,
            visible: widget.value.visible,
            background: widget.value.background,
            singleton: widget.value.singleton,
            mobileReady: widget.value.mobileReady,
            widgetTypes: widget.value.widgetTypes,
        }}

        validationSchema={EditWidgetSchema}
        onSubmit={async (values: WidgetUpdateRequest, actions: FormikActions<WidgetUpdateRequest>) => {
            const isSuccess = await onUpdate(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);

            if (isSuccess) {
                actions.resetForm(values);
            }
        }}
    >
        {(formik: FormikProps<WidgetUpdateRequest>) => (
            <div data-element-id="widget-admin-widget-edit-form">
                <Form className={styles.form}>
                    <div className={styles.formBody}>
                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="displayName"
                            label="Name"
                            placeholder="MyAppComponent"
                        />
                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="description"
                            label="Description"
                            placeholder="Describe the App Component"
                        />
                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="widgetVersion"
                            label="Version"
                            placeholder="1.0"
                        />
                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="universalName"
                            label="Universal Name"
                            placeholder="MyAppComponent.mycompany.com"
                        />

                        <HiddenField
                            inline={true}
                            className={styles.inline_form_label}
                            name="widgetGuid"
                            label="GUID"
                        />

                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="widgetUrl"
                            label="URL"
                            placeholder="https://mycompany.com/appcomponent/MyAppComponent.html"
                        />
                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="imageUrlSmall"
                            label="Small Icon URL"
                            placeholder="https://mycompany.com/appcomponent/images/containerIcon.png"
                        />
                        <TextField
                            inline={true}
                            className={styles.inline_form_label}
                            name="imageUrlMedium"
                            label="Medium Icon URL"
                            placeholder="https://mycompany.com/appcomponent/images/launchMenuIcon.png"
                        />

                        <TextField inline={true} className={styles.inline_form_label} name="width" label="Width" />
                        <TextField inline={true} className={styles.inline_form_label} name="height" label="Height" />

                        <WidgetTypeSelect
                            inline={true}
                            className={styles.inline_form_label}
                            name="widgetType"
                            label="Widget Type"
                            selected={(formik.values.widgetTypes && formik.values.widgetTypes.length > 0) ? formik.values.widgetTypes[0] : undefined}
                            items={items}
                            itemRenderer={renderWidgetType}
                            extractLabel={(item: WidgetTypeReference) => item.name}
                            onSelectItem={(widgetType: WidgetTypeReference) => {
                                formik.setFieldValue("widgetTypes", [widgetType]);
                            }}
                        />

                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="singleton"
                            label="Singleton"
                            defaultChecked={widget.value.singleton}
                        />
                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="mobileReady"
                            label="Mobile Ready"
                            defaultChecked={widget.value.mobileReady}
                        />
                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="visible"
                            label="Visible"
                            defaultChecked={widget.value.visible}
                        />
                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="background"
                            label="Background"
                            defaultChecked={widget.value.background}
                        />
                        
                        {formik.status && formik.status.error && <FormError message={formik.status.error} />}
                    </div>

                    <div className={styles.buttonBar} data-element-id="widget-admin-widget-edit-submit-button">
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

const EditWidgetSchema = object().shape({
    displayName: string().required("Required"),
    widgetUrl: string().required("Required"),
    widgetVersion: string(),
    description: string(),
    imageUrlSmall: string().required("Required"),
    imageUrlMedium: string().required("Required"),
    width: number()
        .integer("Must be an integer")
        .min(200)
        .required("Required"),
    height: number()
        .integer("Must be an integer")
        .min(200)
        .required("Required"),
    widgetGuid: string(),
    universalName: string(),
    visible: boolean(),
    background: boolean(),
    singleton: boolean(),
    mobileReady: boolean(),
    widgetTypes: array().required("Required")
});

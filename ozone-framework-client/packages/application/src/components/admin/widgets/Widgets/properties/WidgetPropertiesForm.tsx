import * as React from "react";

import { MenuItem } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";

import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { WidgetCreateRequest, WidgetUpdateRequest } from "../../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../../api/models/WidgetTypeDTO";

import { CheckBox, FormError, HiddenField, SelectField, SubmitButton, TextField } from "../../../../form";

import * as styles from "../../Widgets.scss";

interface WidgetFormProps {
    widget: WidgetCreateRequest | WidgetUpdateRequest;
    onSubmit: (data: WidgetCreateRequest) => Promise<boolean>;
    widgetTypes: WidgetTypeReference[];
}

const WidgetTypeSelect = SelectField.ofType<WidgetTypeReference>();

const renderWidgetType: ItemRenderer<WidgetTypeReference> = (
    widgetType: WidgetTypeReference,
    { handleClick, modifiers }
) => {
    return <MenuItem key={widgetType.name} onClick={handleClick} text={widgetType.name} />;
};

export const WidgetPropertiesForm: React.FunctionComponent<WidgetFormProps> = ({ widget, onSubmit, widgetTypes }) => (
    <Formik
        initialValues={widget}
        validationSchema={WidgetPropertiesSchema}
        onSubmit={async (
            values: WidgetCreateRequest | WidgetUpdateRequest,
            actions: FormikActions<WidgetCreateRequest>
        ) => {
            values.height = Number(values.height);
            values.width = Number(values.width);

            const isSuccess = await onSubmit(values);
            // the following lines should be removed (I think) if we make it quit on submit. They try to update state on
            // the now-unmounted component, and may mean the memory stays live.
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);
        }}
        enableReinitialize={true}
    >
        {(formik: FormikProps<WidgetCreateRequest | WidgetUpdateRequest>) => (
            <div data-element-id="widget-admin-widget-properties-form">
                <Form className={styles.form} onLoad={() => formik.validateForm()}>
                    <div>
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

                        {/* The initial value of the dropdown needs to be set manually. */}
                        <WidgetTypeSelect
                            inline={true}
                            className={styles.inline_form_label}
                            name="widgetType"
                            label="Widget Type"
                            initialValue={widget.widgetTypes[0]} // NOT `widgetTypes[0]`
                            items={widgetTypes}
                            itemRenderer={renderWidgetType}
                            extractLabel={(item: WidgetTypeReference) => item.name}
                            onSelectItem={(widgetType: WidgetTypeReference) => {
                                // if you set it manually, without this function, the form isn't marked as dirty.
                                formik.setFieldValue("widgetTypes", [widgetType]);
                                formik.validateForm();
                            }}
                        />

                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="singleton"
                            label="Singleton"
                            defaultChecked={widget.singleton}
                        />
                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="mobileReady"
                            label="Mobile Ready"
                            defaultChecked={widget.mobileReady}
                        />
                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="visible"
                            label="Visible"
                            defaultChecked={widget.visible}
                        />
                        <CheckBox
                            inline={true}
                            className={styles.inline_form_label}
                            name="background"
                            label="Background"
                            defaultChecked={widget.background}
                        />

                        {formik.status && formik.status.error && <FormError message={formik.status.error} />}
                    </div>

                    <div className={styles.buttonBar} data-element-id="admin-widget-properties-submit-button">
                        <SubmitButton className={styles.submitButton} />
                    </div>
                </Form>
            </div>
        )}
    </Formik>
);

const WidgetPropertiesSchema = object().shape({
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

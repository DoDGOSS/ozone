import * as React from "react";

import { Intent, MenuItem, Position, Toaster } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";

import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { WidgetCreateRequest, WidgetUpdateRequest } from "../../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../../api/models/WidgetTypeDTO";

import { CheckBox, FormError, HiddenField, SelectField, SubmitButton, TextField } from "../../../../form";

import { uuid } from "../../../../../utility";

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

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export const WidgetPropertiesForm: React.FunctionComponent<WidgetFormProps> = ({ widget, onSubmit, widgetTypes }) => {
    const form = React.useRef<Formik<WidgetCreateRequest>>(null);
    React.useEffect(() => {
        if (form.current) {
            form.current.getFormikActions().validateForm();
        }
    });

    return (
        <Formik
            key={widget && "id" in widget ? widget["id"] : uuid()}
            ref={form}
            initialValues={getInitValues(widget)}
            validationSchema={WidgetPropertiesSchema}
            enableReinitialize={true}
            onSubmit={async (
                values: WidgetCreateRequest | WidgetUpdateRequest,
                actions: FormikActions<WidgetCreateRequest | WidgetUpdateRequest>
            ) => {
                values.height = Number(values.height);
                values.width = Number(values.width);

                if (widget.universalName && widget.universalName !== "" && "id" in values) {
                    // universalName is ID in store. So it cannot be editable.
                    values.universalName = widget.universalName;
                }
                const isSuccess = await onSubmit(values);
                if (isSuccess) {
                    actions.setStatus(null); // what does this do?
                    OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
                    actions.resetForm(values);
                } else {
                    OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
                    actions.setStatus({ error: "An unexpected error has occurred" });
                }
            }}
        >
            {(formik: FormikProps<WidgetCreateRequest | WidgetUpdateRequest>) => (
                <div data-element-id="widget-admin-widget-properties-form">
                    <Form className={styles.form} onLoad={() => formik.validateForm()}>
                        <div>
                            <TextField
                                inline={true}
                                className={styles.inline_form_label}
                                name="displayName"
                                label="Name *"
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
                                disabled={(widget as WidgetUpdateRequest).id !== undefined}
                                className={styles.inline_form_label}
                                name="universalName"
                                label="Universal Name *"
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
                                label="URL *"
                                placeholder="https://mycompany.com/appcomponent/MyAppComponent.html"
                            />
                            <TextField
                                inline={true}
                                className={styles.inline_form_label}
                                name="imageUrlSmall"
                                label="Small Icon URL *"
                                placeholder="https://mycompany.com/appcomponent/images/containerIcon.png"
                            />
                            <TextField
                                inline={true}
                                className={styles.inline_form_label}
                                name="imageUrlMedium"
                                label="Medium Icon URL *"
                                placeholder="https://mycompany.com/appcomponent/images/launchMenuIcon.png"
                            />

                            <TextField
                                inline={true}
                                className={styles.inline_form_label}
                                name="width"
                                label="Width *"
                            />
                            <TextField
                                inline={true}
                                className={styles.inline_form_label}
                                name="height"
                                label="Height *"
                            />

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
};

function getInitValues(widget: WidgetCreateRequest | WidgetUpdateRequest): WidgetCreateRequest | WidgetUpdateRequest {
    if ((!widget.universalName || widget.universalName === "") && (widget.displayName && widget.displayName !== "")) {
        widget.universalName = widget.displayName + "_";
    }
    return widget;
}

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
    universalName: string().required("Required"),
    visible: boolean(),
    background: boolean(),
    singleton: boolean(),
    mobileReady: boolean(),
    widgetTypes: array().required("Required")
});

import * as styles from "./index.scss";

import * as React from "react";
import { useState } from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Radio, RadioGroup } from "@blueprintjs/core";

import { dashboardStore } from "../../stores/DashboardStore";
import { DashboardUpdateRequest } from "../../api/models/DashboardDTO";

import { FormError, SubmitButton, TextField } from "../form";

import { PremadeLayouts } from "./PremadeLayouts";
import { DashboardSelect } from "./DashboardSelect";

import { handleSelectChange, handleStringChange } from "../../utility";

import { assetUrl } from "../../environment";

export interface CreateDashboardFormProps {
    onSubmit: () => void;
    stackId?: number;
}

export interface CreateDashboardOptions {
    name: string;
    description: string;
    presetLayoutName?: string;
    copyId: number;
    stackId?: number;
}

export const CreateDashboardForm: React.FC<CreateDashboardFormProps> = ({ onSubmit, stackId }) => {
    const [selectedValue, setValue] = useState("new");
    const handleRadioChange = handleStringChange(setValue);

    const [selectedPresetLayout, setPresetLayout] = useState<string>();
    const handlePresetLayoutChange = handleStringChange(setPresetLayout);

    const [selectedCopyLayout, setCopyLayout] = useState<number>();
    const handleCopyLayoutChange = handleSelectChange(setCopyLayout);

    return (
        <Formik<CreateDashboardOptions>
            initialValues={{
                name: "",
                description: "",
                presetLayoutName: "",
                copyId: 0,
                stackId
            }}
            onSubmit={(values: CreateDashboardOptions, actions: FormikActions<CreateDashboardOptions>) => {
                values.presetLayoutName = selectedPresetLayout;
                if (selectedValue === "copy") {
                    values.presetLayoutName = selectedValue;
                    values.copyId = selectedCopyLayout!;
                }

                dashboardStore
                    .createDashboard(values)
                    .then(() => {
                        actions.setStatus(null);
                        onSubmit();
                    })
                    .catch(() => {
                        actions.setStatus({ error: "An unexpected error has occurred" });
                    });
            }}
        >
            {(formik: FormikProps<DashboardUpdateRequest>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        {/* Image url stuff removed because bug on backend I couldn't fix; iconImageUrl is never saved.*/}
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            {/* <TextField name="iconImageUrl" label="Icon Url" /> */}
                            <TextField name="description" label="Description" />
                        </div>
                    </div>
                    <RadioGroup onChange={handleRadioChange} selectedValue={selectedValue}>
                        <Radio label="Create new layout" value="new" />
                        <Radio label="Choose a premade layout" value="premade" />
                        {selectedValue === "premade" && (
                            <PremadeLayouts selectedValue={selectedPresetLayout} onChange={handlePresetLayoutChange} />
                        )}
                        <Radio label="Copy the layout of an existing dashboard" value="copy" />
                        {selectedValue === "copy" && (
                            <DashboardSelect selectedValue={selectedCopyLayout} onChange={handleCopyLayoutChange} />
                        )}
                    </RadioGroup>

                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};

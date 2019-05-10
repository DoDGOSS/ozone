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

import { handleStringChange, handleSelectChange } from "../../utility";

import { dashboardService } from "../../stores/DashboardService";

export interface CreateDashboardFormProps {
    onSubmit: () => void;
}

export interface CreateDashboardOptions {
    name: string;
    iconImageUrl: string;
    description: string;
    presetLayoutName: string | null;
}

export const CreateDashboardForm: React.FC<CreateDashboardFormProps> = ({ onSubmit }) => {
    const [selectedValue, setValue] = useState("");
    const handleRadioChange = handleStringChange(setValue);

    const [selectedPresetLayout, setPresetLayout] = useState<string | null>(null);
    const handlePresetLayoutChange = handleStringChange(setPresetLayout);

    const [selectedCopyLayout, setCopyLayout] = useState("");
    const handleCopyLayoutChange = handleSelectChange(setCopyLayout);

    // const [currentDashboard, setCurrentDashboard] = useState<DashboardDTO | null>(null);

    return (
        <Formik<CreateDashboardOptions>
            initialValues={{
                name: "",
                iconImageUrl: "/images/dashboard.png",
                description: "",
                presetLayoutName: null,
                copyGuid: ""
            }}
            onSubmit={(values: CreateDashboardOptions, actions: FormikActions<CreateDashboardOptions>) => {
                values.presetLayoutName = selectedPresetLayout;
                if (selectedValue == "copy") {
                    values.presetLayoutName = selectedValue;
                    values.copyGuid = selectedCopyLayout;
                    // onCopyDashboard(values.presetLayoutName);
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
                        <div className={styles.formIcon}>
                            <img width="60px" src={formik.values.iconImageUrl} />
                        </div>
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            <TextField name="iconImageUrl" label="Icon Url" />
                            <TextField name="description" label="Description" />
                        </div>
                    </div>

                    <RadioGroup onChange={handleRadioChange} selectedValue={selectedValue}>
                        <Radio label="Choose a premade layout" value="premade" />
                        {selectedValue === "premade" && (
                            <PremadeLayouts selectedValue={selectedPresetLayout} onChange={handlePresetLayoutChange} />
                        )}
                        <Radio label="Copy the layout of an existing page" value="copy" />
                        {selectedValue === "copy" && (
                            <DashboardSelect selectedValue={selectedCopyLayout} onChange={handleCopyLayoutChange} />
                        )}
                        <Radio label="Create a new layout" value="new" />
                    </RadioGroup>

                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};

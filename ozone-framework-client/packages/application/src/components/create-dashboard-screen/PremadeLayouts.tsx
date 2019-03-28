import * as React from "react";

import { Field, FieldProps } from "formik";

import { RadioGroup } from "@blueprintjs/core";

import { DEFAULT_LAYOUTS, IMAGE_ROOT_URL } from "../../stores/default-layouts";

import * as styles from "./index.scss";

export interface PremadeLayoutsProps {
    onChange: (event: React.FormEvent<HTMLElement>) => void;
    selectedValue?: string;
}

const _PremadeLayouts: React.FC<PremadeLayoutsProps & FieldProps<any>> = ({ onChange }) => (
    <div className={styles.premadeLayout} data-element-id="PremadeLayoutsList">
        <RadioGroup onChange={onChange}>
            {DEFAULT_LAYOUTS.map((layout) => (
                <button className="layout" key={layout.name} value={layout.name}>
                    <img src={IMAGE_ROOT_URL + layout.iconUrl} />
                </button>
            ))}
        </RadioGroup>
    </div>
);

export const PremadeLayouts: React.FC<PremadeLayoutsProps> = (props) => (
    <Field component={_PremadeLayouts} {...props} />
);

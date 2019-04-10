import * as React from "react";

import { Field, FieldProps } from "formik";

import { Button, FormGroup } from "@blueprintjs/core";

import { ItemRenderer, Select } from "@blueprintjs/select";

import * as styles from "./index.scss";

export interface SelectFieldProps<T> {
    name: string;
    label?: string;
    labelInfo?: string;
    disabled?: boolean;
    inline?: boolean;
    className?: string;
    initialValue: T;
    items: T[];
    itemRenderer: ItemRenderer<T>;
    extractLabel: (item: T) => void;
    onSelectItem: (item: T) => void;
}

export interface SelectFieldState<T> {
    item?: T;
    errors?: any;
}

export class SelectField<T> extends React.Component<SelectFieldProps<T>, SelectFieldState<T>> {
    static ofType<T>() {
        return SelectField as new (props: SelectFieldProps<T>) => SelectField<T>;
    }

    constructor(props: any) {
        super(props);

        const defaultValue: T | undefined = this.props.items ? this.props.items[0] : undefined;
        let initialValue: T | undefined = this.props.initialValue;

        if (initialValue === undefined || !this.isValidOption(initialValue)) {
            initialValue = defaultValue;
        }
        this.state = {
            item: initialValue
        };
    }

    isValidOption(value: T): boolean {
        return (
            this.props.items !== undefined &&
            this.props.items.find((i) => this.props.extractLabel(i) === this.props.extractLabel(value)) !== undefined
        );
    }

    render() {
        const SelectType = Select.ofType<T>();
        return (
            <Field
                name={this.props.name}
                render={(props: FieldProps<any>) => (
                    <FormGroup
                        label={this.props.label}
                        labelFor={this.props.name}
                        labelInfo={this.props.labelInfo}
                        inline={this.props.inline}
                        className={this.props.className}
                    >
                        <SelectType
                            filterable={false}
                            items={this.props.items}
                            itemRenderer={this.props.itemRenderer}
                            onItemSelect={(item: T, event?: React.SyntheticEvent<HTMLElement>) => {
                                this.setState({ item });
                                this.props.onSelectItem(item);
                            }}
                        >
                            <Button
                                name={this.props.name}
                                rightIcon="caret-down"
                                text={
                                    this.state && this.state.item
                                        ? `${this.props.extractLabel(this.state.item)}`
                                        : "(No selection)"
                                }
                            />
                        </SelectType>

                        {props.form.errors[props.field.name] && props.form.touched[props.field.name] && (
                            <div className={styles.validationError}>{props.form.errors}</div>
                        )}
                    </FormGroup>
                )}
                {...this.props}
            />
        );
    }
}

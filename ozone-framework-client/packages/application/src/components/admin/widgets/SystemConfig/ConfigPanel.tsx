import React, { useEffect, useState } from "react";
import { InputGroup, Switch, Tab, Tabs } from "@blueprintjs/core";
import { groupBy, isNil, keys, mapValues } from "lodash";

import { useBehavior } from "../../../../hooks";

import { systemConfigStore } from "../../../../stores/SystemConfigStore";
import { ConfigDTO } from "../../../../api/models/ConfigDTO";

import { StorePanel } from "./StorePanel";

import { classNames } from "../../../../utility";

import * as styles from "./SystemConfigWidget.scss";
import { systemConfigApi } from "../../../../api/clients/SystemConfigAPI";

type ConfigGroup = { [section: string]: ConfigDTO[] };

interface ConfigPanelProps {
    configGroup: ConfigGroup;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ configGroup }) => {
    const sections = keys(configGroup).sort();

    return (
        <div className={styles.configPanel}>
            {sections.map((section) => (
                <ConfigSection key={section} title={section} configs={configGroup[section]} />
            ))}
        </div>
    );
};

interface ConfigSectionProps {
    title: string;
    configs: ConfigDTO[];
}

export const ConfigSection: React.FC<ConfigSectionProps> = ({ title, configs }) => (
    <div>
        {title !== "$DEFAULT$" && <FormRow className={styles.sectionTitle}>{title}</FormRow>}

        {configs.map((config) => (
            <ConfigField key={config.code} config={config} />
        ))}
    </div>
);

interface ConfigFieldProps {
    config: ConfigDTO;
}

export const ConfigField: React.FC<ConfigFieldProps> = ({ config }) =>
    // Suppress the 'Free Text Message' sysconfig option
    config.title !== "Free Text Message" ? (
        <FormRow>
            <FormCell>
                <div className={styles.fieldTitle}>{config.title}</div>
                <div className={styles.fieldDescription}>{config.description}</div>
            </FormCell>
            <FormCell className={styles.centered}>
                <div className={styles.centered}>{getConfigFieldValue(config)}</div>
            </FormCell>
        </FormRow>
    ) : (
        <br />
    );

function getConfigFieldValue(config: ConfigDTO): any {
    if (
        !(
            config &&
            config.hasOwnProperty("type") &&
            config.hasOwnProperty("mutable") &&
            config.hasOwnProperty("value") &&
            config.hasOwnProperty("help") &&
            config.hasOwnProperty("id") &&
            config.hasOwnProperty("groupName")
        )
    ) {
        return <div />;
    }
    if (config.type.toLowerCase() === "boolean" || config.type.toLowerCase() === "bool") {
        return (
            <div data-element-id={"InputFor_" + config.id} data-element-type="toggleInput">
                <Switch
                    className={styles.centered}
                    defaultChecked={config.value !== undefined ? JSON.parse(config.value) : false}
                    id={config.title}
                    title={config.title}
                    disabled={!config.mutable}
                    onChange={(event) => {
                        handleSwitchChange(config, event.currentTarget.checked);
                    }}
                    large={true}
                />
            </div>
        );
    } else if (config.type.toLowerCase() === "string") {
        return (
            <div>
                <div data-element-id={"InputFor_" + config.id} data-element-type="stringInput">
                    <InputGroup
                        name={"NameFor_" + config.id}
                        className={classNames(styles.centered, styles.wideInput)}
                        defaultValue={config.value}
                        disabled={!config.mutable}
                        placeholder={config.help}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.currentTarget.validationMessage === ""
                                ? handleStringChange(config, event.currentTarget.value)
                                : displayStringError(config, event.currentTarget.value);
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.currentTarget.validationMessage === ""
                                ? clearError(config)
                                : displayStringError(config, event.currentTarget.value);
                        }}
                        pattern=".{0,2000}"
                        large={false}
                    />
                </div>
                <div id="errorText" data-element-id={"ErrorMessageFor_" + config.id}>
                    {null}
                </div>
            </div>
        );
    } else if (config.type.toLowerCase() === "integer") {
        return (
            <div>
                <div data-element-id={"InputFor_" + config.id} data-element-type="integerInput">
                    <InputGroup
                        name={"NameFor_" + config.id}
                        className={classNames(styles.centered, styles.wideInput)}
                        defaultValue={config.value}
                        disabled={!config.mutable}
                        placeholder={config.help}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.currentTarget.validationMessage === ""
                                ? handleStringChange(config, event.currentTarget.value.toString())
                                : displayIntegerError(config);
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.currentTarget.validationMessage === ""
                                ? clearError(config)
                                : displayIntegerError(config);
                        }}
                        pattern="^([0-9]{1,2}|1[0-4][0-9]|150)$"
                        large={false}
                        type="textarea"
                    />
                </div>
                <div id="errorText" data-element-id={"ErrorMessageFor_" + config.id}>
                    {null}
                </div>
            </div>
        );
    }
}

function displayStringError(config: ConfigDTO, newValue: string) {
    const errorLocation = document.querySelector("[data-element-id=ErrorMessageFor_" + config.id + "]");
    if (errorLocation) {
        errorLocation.innerHTML = "Maximum characters allowed are 2000, you have " + newValue.length;
    }
}

function displayIntegerError(config: ConfigDTO) {
    const errorLocation = document.querySelector("[data-element-id=ErrorMessageFor_" + config.id + "]");
    if (errorLocation) {
        errorLocation.innerHTML = "You must enter a value between 0 and 150.";
    }
}

function clearError(config: ConfigDTO) {
    const errorLocation = document.querySelector("[data-element-id=ErrorMessageFor_" + config.id + "]");
    if (errorLocation) {
        errorLocation.innerHTML = "";
    }
}

function handleSwitchChange(config: ConfigDTO, newValue: boolean) {
    handleStringChange(config, newValue.toString());
}

function handleStringChange(config: ConfigDTO, newValue: string) {
    const errorLocation = document.querySelector("[data-element-id=ErrorMessageFor_" + config.id + "]");
    if (errorLocation) {
        errorLocation.innerHTML = "";
    }

    if (config.value !== newValue) {
        systemConfigApi.updateConfigById(config.id, newValue).then(() => systemConfigStore.fetchConfigs());
    }
}

interface FormCellProps {
    className?: string;
}

export const FormRow: React.FC<FormCellProps> = (props) => (
    <div className={classNames(styles.formRow, props.className)}>{props.children}</div>
);

export const FormCell: React.FC<FormCellProps> = (props) => (
    <div className={classNames(styles.formCell, props.className)}>{props.children}</div>
);

function sortBySubgroupOrder(a: ConfigDTO, b: ConfigDTO): number {
    if (isNil(a.subGroupOrder)) {
        if (isNil(b.subGroupOrder)) return 0;
        return b.subGroupOrder;
    }

    if (isNil(b.subGroupOrder)) return a.subGroupOrder;

    return a.subGroupOrder - b.subGroupOrder;
}

export function getConfigGroup(configs: ConfigDTO[], groupName: string): ConfigGroup {
    const group = configs.filter((value) => value.groupName === groupName);

    const subgroups = groupBy<ConfigDTO>(group, (config) =>
        isNil(config.subGroupName) ? "$DEFAULT$" : config.subGroupName
    );

    return mapValues(subgroups, (subgroup) => subgroup.sort(sortBySubgroupOrder));
}

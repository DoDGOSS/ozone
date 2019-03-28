import React, { useEffect, useState } from "react";
import { useBehavior } from "../../../../hooks";

import { Tab, Tabs } from "@blueprintjs/core";

import { systemConfigStore } from "../../../../stores/SystemConfigStore";
import { ConfigDTO } from "../../../../api/models/ConfigDTO";

import { groupBy, isNil, keys, mapValues } from "lodash";
import { classNames } from "../../../../utility";

import * as styles from "./SystemConfigWidget.scss";

const AUDITING_TAB = "auditing";
const BRANDING_TAB = "branding";
const ACCOUNTS_TAB = "accounts";
const STORE_TAB = "store";

export const SystemConfigWidget: React.FC = () => {
    useEffect(() => {
        systemConfigStore.fetch();
    }, []);

    const [activeTabId, setActiveTabId] = useState(AUDITING_TAB);

    const configs = useBehavior(systemConfigStore.configs);

    const auditing = getConfigGroup(configs, "AUDITING");
    const branding = getConfigGroup(configs, "BRANDING");
    const accounts = getConfigGroup(configs, "USER_ACCOUNT_SETTINGS");

    return (
        <div>
            <Tabs
                id="TabsExample"
                onChange={(newTabId: string) => setActiveTabId(newTabId)}
                selectedTabId={activeTabId}
                vertical={true}
            >
                <Tab id={AUDITING_TAB} title="Auditing" panel={<ConfigPanel configGroup={auditing} />} />

                <Tab id={BRANDING_TAB} title="Branding" panel={<ConfigPanel configGroup={branding} />} />

                <Tab id={ACCOUNTS_TAB} title="User Account Settings" panel={<ConfigPanel configGroup={accounts} />} />

                <Tab id={STORE_TAB} title="Store" panel={<StorePanel />} />
                <Tabs.Expander />
            </Tabs>
        </div>
    );
};

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
    <>
        {title !== "$DEFAULT$" && <FormRow className={styles.sectionTitle}>{title}</FormRow>}

        {configs.map((config) => (
            <ConfigField key={config.code} config={config} />
        ))}
    </>
);

interface ConfigFieldProps {
    config: ConfigDTO;
}

export const ConfigField: React.FC<ConfigFieldProps> = ({ config }) => (
    <FormRow>
        <FormCell>
            <div className={styles.fieldTitle}>{config.title}</div>
            <div className={styles.fieldDescription}>{config.description}</div>
        </FormCell>
        <FormCell>
            <div>Value: {config.value}</div>
            <div>Help: {config.help}</div>
            <div>Type: {config.type}</div>
            <div>Mutable: {config.mutable}</div>
        </FormCell>
    </FormRow>
);

interface Props {
    className?: string;
}

export const FormRow: React.FC<Props> = (props) => (
    <div className={classNames(styles.formRow, props.className)}>{props.children}</div>
);

export const FormCell: React.FC<Props> = (props) => (
    <div className={classNames(styles.formCell, props.className)}>{props.children}</div>
);

export const StorePanel: React.FC = () => <div>Store</div>;

function sortBySubgroupOrder(a: ConfigDTO, b: ConfigDTO): number {
    if (isNil(a.subGroupOrder)) {
        if (isNil(b.subGroupOrder)) return 0;
        return b.subGroupOrder;
    }

    if (isNil(b.subGroupOrder)) return a.subGroupOrder;

    return a.subGroupOrder - b.subGroupOrder;
}

type ConfigGroup = { [section: string]: ConfigDTO[] };

function getConfigGroup(configs: ConfigDTO[], groupName: string): ConfigGroup {
    const group = configs.filter((value) => value.groupName === groupName);

    const subgroups = groupBy<ConfigDTO>(group, (config) =>
        isNil(config.subGroupName) ? "$DEFAULT$" : config.subGroupName
    );

    return mapValues(subgroups, (subgroup) => subgroup.sort(sortBySubgroupOrder));
}

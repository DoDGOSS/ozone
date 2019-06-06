import React, { useEffect, useState } from "react";
import { InputGroup, Switch, Tab, Tabs } from "@blueprintjs/core";
import { groupBy, isNil, keys, mapValues } from "lodash";

import { useBehavior } from "../../../../hooks";

import { systemConfigStore } from "../../../../stores/SystemConfigStore";
import { ConfigDTO } from "../../../../api/models/ConfigDTO";

import { StorePanel } from "./StorePanel";
import { ConfigPanel, getConfigGroup } from "./ConfigPanel";

import { classNames } from "../../../../utility";

import * as styles from "./SystemConfigWidget.scss";
import { systemConfigApi } from "../../../../api/clients/SystemConfigAPI";

const AUDITING_TAB = "auditing";
const BRANDING_TAB = "branding";
const ACCOUNTS_TAB = "accounts";
const STORE_TAB = "store";

export const SystemConfigWidget: React.FC = () => {
    useEffect(() => {
        systemConfigStore.fetchConfigs();
    }, []);

    const [activeTabId, setActiveTabId] = useState(AUDITING_TAB);

    const configs = useBehavior(systemConfigStore.configs);

    const auditing = getConfigGroup(configs, "AUDITING");
    const branding = getConfigGroup(configs, "BRANDING");
    const accounts = getConfigGroup(configs, "USER_ACCOUNT_SETTINGS");

    return (
        <div data-element-id="systemconfig-admin-widget-dialog">
            <Tabs
                id="ConfigTabs"
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

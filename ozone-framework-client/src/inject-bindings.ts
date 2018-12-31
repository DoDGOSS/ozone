/**
 * In order to prevent circular dependencies between inject.ts and the
 * injectable components, all components should be imported and bound to the
 * container in this file.
 */

import { container, TYPES } from "./inject";

import { OzoneGateway } from "./services";
import { AuthStore, ConfigStore, DashboardStore, MainStore, WidgetStore } from "./stores";

import { DashboardAPI, GroupAPI, UserAPI } from "./api";


export default function initializeIocContainerBindings() {
    container.bind(AuthStore).toSelf().inSingletonScope();
    container.bind(ConfigStore).toSelf().inSingletonScope();
    container.bind(DashboardStore).toSelf().inSingletonScope();
    container.bind(MainStore).toSelf().inSingletonScope();
    container.bind(WidgetStore).toSelf().inSingletonScope();

    container.bind(TYPES.Gateway).to(OzoneGateway).inSingletonScope();

    container.bind(DashboardAPI).toSelf().inSingletonScope();
    container.bind(GroupAPI).toSelf().inSingletonScope();
    container.bind(UserAPI).toSelf().inSingletonScope();
}

/**
 * In order to prevent circular dependencies between inject.ts and the
 * injectable components, all components should be imported and bound to the
 * container in this file.
 */

import { container } from "./inject";

import { ConfigService } from "./services";
import { ConfigStore, MainStore, WidgetStore } from "./stores";

import { OzoneGateway } from "./api";
import { AuthStore } from "./stores/AuthStore";


export default function initializeIocContainerBindings() {
    container.bind(ConfigService).toSelf().inSingletonScope();

    container.bind(AuthStore).toSelf().inSingletonScope();
    container.bind(ConfigStore).toSelf().inSingletonScope();
    container.bind(MainStore).toSelf().inSingletonScope();
    container.bind(WidgetStore).toSelf().inSingletonScope();

    container.bind(OzoneGateway).toSelf().inSingletonScope();
}

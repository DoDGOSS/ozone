import { configure as configureMobX } from "mobx";
import initializeIocContainerBindings from "./inject-bindings";

export default function initializeApplication() {
    configureMobX({
        enforceActions: "never"
    });

    initializeIocContainerBindings();
}

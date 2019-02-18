import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { UNCLASSIFIED_FOUO } from "../classifications";

export class ConfigStore {
    private readonly classification$ = new BehaviorSubject(UNCLASSIFIED_FOUO);

    classification = () => asBehavior(this.classification$);
}

export const configStore = new ConfigStore();

import { action, observable, runInAction } from "mobx";

import { injectable } from "../inject";

import { ClassificationConfig } from "../interfaces";
import { UNCLASSIFIED_FOUO } from "../classifications";


@injectable()
export class ConfigStore {

    @observable
    classification: ClassificationConfig;

    constructor() {
        runInAction("initialize", () => {
            this.classification = UNCLASSIFIED_FOUO;
        });
    }

    @action.bound
    setClassification(classification: ClassificationConfig) {
        this.classification = classification;
    }

}

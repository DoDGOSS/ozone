import { action, observable, runInAction } from "mobx";

import { injectable } from "../inject";

import { ClassificationConfig } from "../interfaces";
import { UNCLASSIFIED_FOUO } from "../classifications";

@injectable()
export class ConfigStore {
    @observable
    classification: ClassificationConfig;

    @observable
    consentForm: boolean;

    constructor() {
        runInAction("initialize", () => {
            this.classification = UNCLASSIFIED_FOUO;
            this.consentForm = true;
        });
    }

    @action.bound
    setClassification(classification: ClassificationConfig) {
        this.classification = classification;
    }
}

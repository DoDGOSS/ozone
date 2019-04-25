import { IntentDTO } from "../api/models/IntentDTO";

import { Intent } from "../models/Intent";

export function intentFromJson(dto: IntentDTO): Intent {
    return new Intent({
        action: dto.action,
        dataTypes: dto.dataTypes
    });
}

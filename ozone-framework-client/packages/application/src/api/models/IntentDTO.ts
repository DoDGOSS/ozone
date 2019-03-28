export interface IntentDTO {
    action: string;
    dataTypes: string[];
}

export interface IntentsDTO {
    send: IntentDTO[];
    receive: IntentDTO[];
}

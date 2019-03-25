import { createValidator } from "./validate";
import { CONFIG_LIST_SCHEMA, CONFIG_SCHEMA } from "./schemas/config.schema";

export interface ConfigDTO {
    id: number;
    code: string;
    value?: string;
    type: string;
    title: string;
    description?: string;
    help?: string;
    mutable: boolean;
    groupName: string;
    subGroupName?: string;
    subGroupOrder?: number;
}

export const validateConfig = createValidator<ConfigDTO>(CONFIG_SCHEMA);

export const validateConfigList = createValidator<ConfigDTO[]>(CONFIG_LIST_SCHEMA);

export interface ConfigUpdateRequest {
    id: number;
    value?: string;
}

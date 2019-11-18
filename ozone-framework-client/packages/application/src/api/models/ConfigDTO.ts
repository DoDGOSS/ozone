import { createValidator } from "./validate";
import { CONFIG_LIST_SCHEMA, CONFIG_SCHEMA } from "./schemas/config.schema";
import { ListOf } from "../interfaces";

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

export const validateConfigDetailResponse = createValidator<ConfigDTO>(CONFIG_SCHEMA);
export const validateConfigListResponse = createValidator<ListOf<ConfigDTO[]>>(CONFIG_LIST_SCHEMA);

export interface ConfigUpdateRequest {
    id: number;
    value?: string;
}

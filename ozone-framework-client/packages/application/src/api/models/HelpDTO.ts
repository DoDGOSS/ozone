import { createValidator } from "./validate";
import { HELP_GET_RESPONSE_SCHEMA } from "./schemas/help.schema";

export type HelpItemDTO = HelpFileDTO | HelpFolderDTO;

export interface HelpFileDTO {
    text: string;
    path: string;
    leaf: true;
}

export interface HelpFolderDTO {
    text: string;
    path: string;
    leaf: false;
    children: HelpItemDTO[];
}

export function isHelpFolder(item: HelpItemDTO): item is HelpFolderDTO {
    return item.leaf === false;
}

export type HelpGetResponse = HelpItemDTO[];

export const validateHelpGetResponse = createValidator<HelpGetResponse>(HELP_GET_RESPONSE_SCHEMA);

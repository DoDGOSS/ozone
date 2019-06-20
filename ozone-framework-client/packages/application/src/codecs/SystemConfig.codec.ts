import { ConfigDTO } from "../api/models/ConfigDTO";
import { SystemConfig } from "../models/SystemConfig";
import { isNil } from "../utility";

export function systemConfigFromJson(configs: ConfigDTO[]): SystemConfig {
    return {
        backgroundImageUrl: findSettingByCode(configs, "owf.custom.background.url"),
        headerHeight: findSettingByCode(configs, "owf.custom.header.height"),
        headerUrl: findSettingByCode(configs, "owf.custom.header.url"),
        footerHeight: findSettingByCode(configs, "owf.custom.footer.height"),
        footerUrl: findSettingByCode(configs, "owf.custom.footer.url"),
        customCss: findSettingByCode(configs, "owf.custom.css"),
        customJs: findSettingByCode(configs, "owf.custom.jss")
    };
}

function findSettingByCode(configs: ConfigDTO[], code: string): string | undefined {
    const results = configs.filter((config) => config.code === code);
    if (results.length < 1) return undefined;

    const value = results[0].value;
    return !isNil(value) ? value : undefined;
}

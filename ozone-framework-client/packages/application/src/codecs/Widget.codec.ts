import { WidgetDTO } from "../api/models/WidgetDTO";

import { Widget } from "../models/Widget";

import { intentFromJson } from "./Intent.codec";
import { widgetTypeFromJson } from "./WidgetType.codec";

import { optional } from "../utility";

export function widgetFromJson(dto: WidgetDTO): Widget {
    const props = dto.value;

    return new Widget({
        description: optional(props.description),
        descriptorUrl: optional(props.descriptorUrl),
        height: props.height,
        id: dto.path,
        images: {
            smallUrl: props.smallIconUrl,
            largeUrl: props.mediumIconUrl
        },
        intents: {
            send: props.intents.send.map(intentFromJson),
            receive: props.intents.receive.map(intentFromJson)
        },
        isBackground: props.background,
        isDefinitionVisible: props.definitionVisible,
        isMaximized: props.maximized,
        isMinimized: props.minimized,
        isMobileReady: props.mobileReady,
        isSingleton: props.singleton,
        isVisible: props.visible,
        metadata: {
            allRequired: props.allRequired,
            directRequired: props.directRequired,
            totalGroups: props.totalGroups,
            totalUsers: props.totalUsers
        },
        title: props.namespace,
        universalName: optional(props.universalName),
        url: props.url,
        types: props.widgetTypes.map(widgetTypeFromJson),
        version: optional(props.widgetVersion),
        width: props.width,
        x: props.x,
        y: props.y
    });
}

import { map } from "lodash";

import { Widget } from "../models/Widget";
import { WidgetDTO } from "../api/models/WidgetDTO";

import { optional } from "../utility";
import { intentFromJson } from "./Intent.codec";
import { widgetTypeFromJson } from "./WidgetType.codec";

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
            send: map(props.intents.send, intentFromJson),
            receive: map(props.intents.receive, intentFromJson)
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
        types: map(props.widgetTypes, widgetTypeFromJson),
        version: optional(props.widgetVersion),
        width: props.width,
        x: props.x,
        y: props.y
    });
}

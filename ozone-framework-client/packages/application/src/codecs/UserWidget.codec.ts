import { map } from "lodash";

import { UserWidget } from "../models/UserWidget";
import { UserWidgetDTO } from "../api/models/UserWidgetDTO";
import { Widget } from "../models/Widget";

import { optional } from "../utility";
import { intentFromJson } from "./Intent.codec";
import { widgetTypeFromJson } from "./WidgetType.codec";

export function userWidgetFromJson(dto: UserWidgetDTO): UserWidget {
    const props = dto.value;

    return new UserWidget({
        id: dto.id,
        isDisabled: props.disabled,
        isEditable: props.editable,
        isFavorite: props.favorite,
        isGroupWidget: props.groupWidget,
        originalTitle: props.originalName,
        position: props.position,
        user: {
            username: props.userId,
            displayName: props.userRealName
        },
        widget: new Widget({
            isBackground: props.background,
            isDefinitionVisible: props.definitionVisible,
            description: optional(props.description),
            descriptorUrl: optional(props.descriptorUrl),
            height: props.height,
            id: dto.path,
            images: {
                smallUrl: props.smallIconUrl,
                largeUrl: props.largeIconUrl
            },
            intents: {
                send: map(props.intents.send, intentFromJson),
                receive: map(props.intents.receive, intentFromJson)
            },
            isMaximized: props.maximized,
            isMinimized: props.minimized,
            isMobileReady: props.mobileReady,
            isSingleton: props.singleton,
            title: props.namespace,
            universalName: optional(props.universalName),
            url: props.url,
            isVisible: props.visible,
            types: map(props.widgetTypes, widgetTypeFromJson),
            version: optional(props.widgetVersion),
            width: props.width,
            x: props.x,
            y: props.y
        })
    });
}

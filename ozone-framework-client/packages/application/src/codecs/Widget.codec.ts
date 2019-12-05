import { WidgetCreateRequest, WidgetDTO, WidgetUpdateRequest } from "../api/models/WidgetDTO";

import { Widget } from "../models/Widget";

import { intentFromJson } from "./Intent.codec";
import { widgetTypeFromJson } from "./WidgetType.codec";

import { optional, uuid } from "../utility";

export function widgetFromJson(dto: WidgetDTO): Widget {
    const props = dto.value;
    return new Widget({
        description: optional(props.description),
        descriptorUrl: optional(props.descriptorUrl),
        height: props.height,
        id: dto.id,
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
        universalName: props.universalName,
        widgetGuid: props.widgetGuid,
        url: props.url,
        types: props.widgetTypes.map(widgetTypeFromJson),
        version: optional(props.widgetVersion),
        width: props.width,
        x: props.x,
        y: props.y
    });
}

export function widgetCreateRequestFromWidget(widget: Widget): WidgetCreateRequest {
    return {
        displayName: widget.title,
        widgetVersion: widget.version ? widget.version : "",
        description: widget.description ? widget.description : "",
        widgetUrl: widget.url,
        imageUrlSmall: widget.images.smallUrl,
        imageUrlMedium: widget.images.largeUrl,
        width: widget.width,
        height: widget.height,
        widgetGuid: uuid(),
        universalName: widget.universalName,
        visible: widget.isVisible,
        background: widget.isBackground,
        singleton: widget.isSingleton,
        mobileReady: widget.isMobileReady,
        widgetTypes: widget.types,
        descriptorUrl: widget.descriptorUrl,
        intents: widget.intents
    };
}

export function widgetUpdateRequestFromWidget(widget: Widget): WidgetUpdateRequest {
    return {
        displayName: widget.title,
        widgetVersion: widget.version ? widget.version : "",
        description: widget.description ? widget.description : "",
        widgetUrl: widget.url,
        imageUrlSmall: widget.images.smallUrl,
        imageUrlMedium: widget.images.largeUrl,
        width: widget.width,
        height: widget.height,
        widgetGuid: widget.widgetGuid,
        id: widget.id!,
        universalName: widget.universalName,
        visible: widget.isVisible,
        background: widget.isBackground,
        singleton: widget.isSingleton,
        mobileReady: widget.isMobileReady,
        widgetTypes: widget.types,
        descriptorUrl: widget.descriptorUrl,
        intents: widget.intents
    };
}

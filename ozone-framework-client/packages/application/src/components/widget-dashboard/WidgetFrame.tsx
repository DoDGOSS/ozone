import * as styles from "./index.scss";

import React from "react";

import { UserWidget } from "../../models/UserWidget";

import { SYSTEM_WIDGET_URLS } from "../../stores/system-widgets";

export interface WidgetFrameProps {
    widget: UserWidget;
}

const _WidgetFrame: React.FC<WidgetFrameProps> = ({ widget }) => {
    const url = widget.widget.url;
    if (url.startsWith("local:")) {
        const element = SYSTEM_WIDGET_URLS[url];
        if (!element) {
            return <div />;
        }
        return element;
    }

    const def = widget.widget;

    const nameJson = JSON.stringify({
        id: def.id,
        guid: def.id,
        url: def.url,
        owf: true,
        version: "1.0",
        containerVersion: "7.15.1",
        locked: false,
        layout: "tabbed",
        webContextPath: "/",
        preferenceLocation: "http://localhost:8080/prefs",
        relayUrl: "http://localhost:3000/rpc_relay.uncompressed.html",
        lang: "en_US",
        currentTheme: {
            themeName: "a_default",
            themeContrast: "standard",
            themeFontSize: 12
        },
        data: widget.launchData
    });

    return <iframe className={styles.widgetFrame} src={def.url} id={`widget-${def.id}`} name={nameJson} />;
};

export const WidgetFrame = React.memo(_WidgetFrame);

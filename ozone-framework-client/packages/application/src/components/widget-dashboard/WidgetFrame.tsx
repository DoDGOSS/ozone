import React from "react";

import { Widget } from "../../stores/interfaces";

import * as styles from "./index.scss";

export interface WidgetFrameProps {
    widget: Widget;
}

const _WidgetFrame: React.FC<WidgetFrameProps> = ({ widget }) => {
    const element = widget.definition.element;
    if (element !== null && element !== undefined) {
        return element;
    }

    const url = widget.definition.url;
    if (url === null || url === undefined) {
        return <div />;
    }

    const def = widget.definition;

    const id = widget.id;
    const nameJson = JSON.stringify({
        id,
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
        }
    });

    return <iframe className={styles.widgetFrame} src={def.url} id={`widget-${widget.id}`} name={nameJson} />;
};

export const WidgetFrame = React.memo(_WidgetFrame);

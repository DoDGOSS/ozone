require("../dist/owf-widget");

const OZONE_PROPERTIES = {
    Widget: {},
    audit: {},
    chrome: {},
    components: {},
    config: {},
    dragAndDrop: {},
    eventing: {},
    lang: {},
    launcher: {},
    layout: {},
    log: {},
    metrics: {},
    pref: {},
    state: {},
    util: {},
    ux: {},
    version: {},
    widgetAccesses: {}
};

const OWF_PROPERTIES = {
    Audit: {},
    Chrome: {},
    DragAndDrop: {},
    Eventing: {},
    Intents: {},
    Lang: {},
    Launcher: {},
    Log: {},
    Metrics: {},
    Preferences: {},
    RPC: {},
    Util: {},
    Version: {},
    _init: {},
    getContainerName: {},
    getContainerUrl: {},
    getContainerVersion: {},
    getCurrentTheme: {},
    getDashboardLayout: {},
    getIframeId: {},
    getInstanceId: {},
    getOpenedWidgets: {},
    getPanes: {},
    getUrl: {},
    getVersion: {},
    getWidgetGuid: {},
    isDashboardLocked: {},
    notifyWidgetReady: {},
    ready: {}
};



describe("Global namespaces (internal)", () => {

    test("window.Ozone is defined", () => {
        expect(window).hasOwnProperty("Ozone")
    });

    test("window.OWF is defined", () => {
        expect(window).hasOwnProperty("OWF")
    });

    test("window.guid is defined", () => {
        expect(window).hasOwnProperty("guid")
    });

});

describe("Global namespaces (third-party)", () => {

    test("window.owfdojo is defined", () => {
        expect(window).hasOwnProperty("owfdojo")
    });

    test("window.gadgets is defined", () => {
        expect(window).hasOwnProperty("gadgets")
    });

    test("window.log4javascript is defined", () => {
        expect(window).hasOwnProperty("log4javascript")
    });

});


test("Ozone namespace properties", () => {
    const actualNamespaces = getSortedProperties(window.Ozone);
    const expectedNamespaces = getSortedProperties(OZONE_PROPERTIES);

    expect(actualNamespaces).toEqual(expectedNamespaces);
});

test("OWF namespace properties", () => {
    const actualNamespaces = getSortedProperties(window.OWF);
    const expectedNamespaces = getSortedProperties(OWF_PROPERTIES);

    expect(actualNamespaces).toEqual(expectedNamespaces);
});

test("guid namespace properties", () => {
    const actualNamespaces = getSortedProperties(window.guid);
    const expectedNamespaces = getSortedProperties({util: {}});

    expect(actualNamespaces).toEqual(expectedNamespaces);
});

function getSortedProperties(obj) {
    return Object.getOwnPropertyNames(obj).sort();
}

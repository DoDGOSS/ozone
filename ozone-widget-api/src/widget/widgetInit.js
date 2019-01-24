window.Ozone = window.Ozone || {};
var Ozone = window.Ozone;

if (!Ozone.disableWidgetInit) {
    Ozone.util.internal.onDocumentReady(function() {
        //calc pageload time
        Ozone.util.pageLoad.afterLoad = (new Date()).getTime();
        Ozone.util.pageLoad.calcLoadTime();

        if(Ozone.util.isInContainer()) {
            OWF._init(window, document);
        }
    });
}

window.Ozone = window.Ozone || {};
var Ozone = window.Ozone;

Ozone.components = Ozone.components || {};
Ozone.components.keys = Ozone.components.keys || {};

Ozone.components.keys.createKeyEventSender = function(widgetEventingController) {

    const _ = Ozone.util.internal;

    Ozone.internal.rpc.register("_focus_widget_window", function() {
        try {
            window.focus();
        } catch (e) {
        }
    });

    Ozone.internal.rpc.send("_widget_iframe_ready", null, widgetEventingController.getWidgetId());

    function keyMatches(event, includeCtrl) {
        return (key) => {
            return (
                key.key === event.keyCode &&
                (includeCtrl ? key.ctrl === event.ctrlKey : true) &&
                key.alt === event.altKey &&
                key.shift === event.shiftKey
            );
        };
    }

    document.addEventListener("keyup", (event) => {
        const found = _.forFirst(Ozone.components.keys.HotKeys, keyMatches(event), (key) => {
            if (key.focusParent === true) {
                parent.focus();
            }

            Ozone.internal.rpc.send("_key_eventing", null, widgetEventingController.getWidgetId(), {
                keyCode: event.keyCode,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
                focusParent: key.focusParent
            });
        });
        if (found) return;

        _.forFirst(Ozone.components.keys.MoveHotKeys, keyMatches(event, true), (key) => {
            Ozone.internal.rpc.send("_key_eventing", null, widgetEventingController.getWidgetId(), {
                keyCode: event.keyCode,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
                focusParent: key.focusParent
            });
        });
    });

    document.addEventListener("keydown", (event) => {
        _.forFirst(Ozone.components.keys.MoveHotKeys, keyMatches(event, true), (key) => {
            Ozone.internal.rpc.send("_key_eventing", null, widgetEventingController.getWidgetId(), {
                keyCode: event.keyCode,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
                keydown: true,
                focusParent: key.focusParent
            });
        });
    });

};

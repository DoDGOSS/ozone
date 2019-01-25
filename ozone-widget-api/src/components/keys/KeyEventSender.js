window.Ozone = window.Ozone || {};
var Ozone = window.Ozone;

Ozone.components = Ozone.components || {};
Ozone.components.keys = Ozone.components.keys || {};

Ozone.components.keys.createKeyEventSender = function (widgetEventingController) {

    gadgets.rpc.register('_focus_widget_window', function () {
        try {
            window.focus();
        } catch (e) {
        }
    });

    gadgets.rpc.call('..', '_widget_iframe_ready', null, widgetEventingController.getWidgetId());

    document.addEventListener("keyup", (context, event) => {
        for (let key of Ozone.components.keys.HotKeys) {
            if (key.key === event.keyCode
                && key.alt === event.altKey
                && key.shift === event.shiftKey) {

                if (key.focusParent === true) {
                    parent.focus();
                }

                gadgets.rpc.call('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: event.keyCode,
                    altKey: event.altKey,
                    shiftKey: event.shiftKey,
                    focusParent: key.focusParent
                });

                return;
            }
        }

        for (let key of Ozone.components.keys.MoveHotKeys) {
            if (key.key === event.keyCode
                && key.ctrl === event.ctrlKey
                && key.alt === event.altKey
                && key.shift === event.shiftKey) {

                gadgets.rpc.call('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: event.keyCode,
                    ctrlKey: event.ctrlKey,
                    altKey: event.altKey,
                    shiftKey: event.shiftKey,
                    focusParent: key.focusParent
                });

                return;
            }
        }
    });

    document.addEventListener("keydown", (context, event) => {
        for (let key of Ozone.components.keys.MoveHotKeys) {
            if (key.key === event.keyCode
                && key.ctrl === event.ctrlKey
                && key.alt === event.altKey
                && key.shift === event.shiftKey) {

                gadgets.rpc.call('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: event.keyCode,
                    ctrlKey: event.ctrlKey,
                    altKey: event.altKey,
                    shiftKey: event.shiftKey,
                    keydown: true,
                    focusParent: key.focusParent
                });

                return;
            }
        }
    });

};

// tag::proxy[]
function getColorServerProxy(callback) {
    setError();

    OWF.getOpenedWidgets(function(widgets) {
        if (!widgets) {
            setError("Failed to get opened widgets");
            return;
        }

        const colorServerId = findWidgetIdByName(widgets, /^.*Color Server.*$/);
        if (!colorServerId) {
            setError("Color Server widget not found");
            return;
        }

        OWF.RPC.getWidgetProxy(colorServerId, function(proxy) {
            if (!proxy) {
                setError("Failed to get widget proxy for Color Server");
                return;
            }
            callback(proxy);
        });
    });
}
// end::proxy[]

// tag::find[]
function findWidgetIdByName(widgets, regexp) {
    for (let i = 0; i < widgets.length; i++) {
        let widget = widgets[i];
        if (widget.id != null && widget.name.match(regexp) != null) {
            return widget.id;
        }
    }
    return null;
}

function setError(message) {
    const errors = document.getElementById("errors");
    errors.style.display = message ? "block" : "none";
    errors.innerText = message || "";
}
// end::find[]

// tag::colors[]
function getColors() {
    getColorServerProxy(function(colorServer) {
        colorServer.getColors(updateColorChoices);
    });
}

function setColor(color) {
    getColorServerProxy(function(colorServer) {
        colorServer.changeColor(color);
    });
}
// end::colors[]

// tag::update[]
function updateColorChoices(colors) {
    const selectBox = document.getElementById("colors");

    // Remove previous `option` elements
    for (let i = selectBox.options.length - 1; i >= 0; i--) {
        selectBox.remove(i);
    }

    // Create an `option` element for each color
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const option = document.createElement("option");
        option.text = color;
        option.value = color;
        selectBox.add(option);
    }
}
// end::update[]





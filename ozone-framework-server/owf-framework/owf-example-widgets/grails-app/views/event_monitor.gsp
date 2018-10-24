<!DOCTYPE html>
<html>
<head>
    <owf:stylesheet src="static/css/dragAndDrop.css"/>

    <owf:frameworkJs src="owf-widget.js"/>

    <script type="text/javascript">
        //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
        //Ozone.eventing.Widget.widgetRelayURL = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

        owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

        /**
         * Called on widget load.  Initializes the eventing capabilities.
         */

        var eventMonitor = {};

        function init() {
            // initialize the eventing
            eventMonitor.widgetEventingController = Ozone.eventing.Widget.getInstance();

            eventMonitor.widgetState = Ozone.state.WidgetState.getInstance({
                widgetEventingController: eventMonitor.widgetEventingController,
                autoInit: true,
                onStateEventReceived: handleStateEvent
            });

            eventMonitor.registeredEvents = eventMonitor.widgetState.getRegisteredStateEvents({
                callback: function (events) {
                    for (var i = 0; i < events.length; i++) {
                        var docfrag = document.createDocumentFragment();
                        var option = document.createElement("option");
                        option.setAttribute("id", events[i]);
                        option.setAttribute("value", events[i]);
                        var text = document.createTextNode(events[i]);
                        option.appendChild(text);
                        docfrag.appendChild(option);
                        document.getElementById("stateEvent").appendChild(docfrag);
                    }

                    updateWidgetState();
                }
            });

            eventMonitor.listeners = [];
            eventMonitor.overrides = [];
        }

        function onUnload() {
            eventMonitor.widgetState.removeStateEventListeners({
                events: eventMonitor.listeners
            });

            eventMonitor.widgetState.removeStateEventOverrides({
                events: eventMonitor.overrides
            });
        }

        function getCurrentTime() {
            var currentTime = new Date();

            var currentHours = currentTime.getHours();
            var currentMinutes = currentTime.getMinutes();
            var currentSeconds = currentTime.getSeconds();

            // Pad the minutes and seconds with leading zeros, if required
            currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
            currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

            // Choose either "AM" or "PM" as appropriate
            var timeOfDay = (currentHours < 12) ? "AM" : "PM";

            // Convert the hours component to 12-hour format if needed
            currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

            // Convert an hours component of "0" to "12"
            currentHours = (currentHours == 0) ? 12 : currentHours;

            // Compose the string for display
            var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

            return currentTimeString;
        }

        function addEventToList(event, selectedList) {
            var docfrag = document.createDocumentFragment();
            var option = document.createElement("option");
            option.setAttribute("id", event);
            option.setAttribute("value", event);
            var text = document.createTextNode(event);
            option.appendChild(text);
            docfrag.appendChild(option);
            document.getElementById(selectedList).appendChild(docfrag);
        }

        function removeEventFromList(event, selectedList) {
            if (event) {
                var childnode = document.getElementById(event);
                if (childnode) {
                    document.getElementById(selectedList).removeChild(childnode);
                }
            }
        }

        function addStateEvent() {
            var type = document.getElementById("eventType").value;
            var event = document.getElementById("stateEvent").value;

            switch (type) {
                case "listen":
                    eventMonitor.listeners.push(event);
                    eventMonitor.widgetState.addStateEventListeners({
                        events: [event],
                        callback: function () {
                            // Remove from stateEvent list
                            removeEventFromList(event, "stateEvent");

                            // Add to Monitored Events List
                            addEventToList(event, "monitoredEvents");
                        }
                    });
                    break;
                case "override":
                    eventMonitor.overrides.push(event);
                    return eventMonitor.widgetState.addStateEventOverrides({
                        events: [event],
                        callback: function () {
                            // Remove from stateEvent list
                            removeEventFromList(event, "stateEvent");

                            // Add to Monitored Events List
                            addEventToList(event, "overriddenEvents");
                        }
                    });
                    break;
                default:
                    return;
            }
            return false;
        }

        function removeStateEvent(type, event) {
            switch (type) {
                case "listen":
                    event = event ? event : document.getElementById("monitoredEvents").value;

                    // Remove from listeners array
                    var tmpArr = [];
                    for (var i = 0; i < eventMonitor.listeners.length; i++) {
                        if (eventMonitor.listeners[i] != event) {
                            tmpArr.push(eventMonitor.listeners[i]);
                        }
                    }
                    eventMonitor.listeners = tmpArr;

                    return eventMonitor.widgetState.removeStateEventListeners({
                        events: [event],
                        callback: function () {
                            // Remove from stateEvent list
                            removeEventFromList(event, "monitoredEvents");

                            // Add to Monitored Events List
                            addEventToList(event, "stateEvent");
                        }
                    });
                case "override":
                    event = event ? event : document.getElementById("overriddenEvents").value;

                    // Remove from overrides array
                    var tmpArr = [];
                    for (var i = 0; i < eventMonitor.overrides.length; i++) {
                        if (eventMonitor.overrides[i] != event) {
                            tmpArr.push(eventMonitor.overrides[i]);
                        }
                    }
                    eventMonitor.overrides = tmpArr;

                    return eventMonitor.widgetState.removeStateEventOverrides({
                        events: [event],
                        callback: function () {
                            // Remove from stateEvent list
                            removeEventFromList(event, "overriddenEvents");

                            // Add to Monitored Events List
                            addEventToList(event, "stateEvent");
                        }
                    });
                default:
                    return;
            }
        }

        function appendTextToDiv(div, text) {
            var br = document.createElement("br")
            document.getElementById(div).appendChild(br);
            var textNode = document.createTextNode(text);
            document.getElementById(div).appendChild(textNode)
        }

        function updateWidgetState() {
            eventMonitor.widgetState.getWidgetState({
                callback: function (state) {
                    var html = "Name: " + state.name + "<br />";
                    html += "Height: " + state.height + "<br />";
                    html += "Width: " + state.width + "<br />";
                    html += "X: " + state.x + "<br />";
                    html += "Y: " + state.y + "<br />";
                    document.getElementById("currentState").innerHTML = html;
                }
            });
        }

        /**
         * This function relays state events back to the dashboard.  It's called as a callback when
         * a state event is received.
         */
        function handleStateEvent(sender, msg) {
            // Print out event by type
            var eventAction;
            var currentTime = getCurrentTime();

            for (var i = 0; i < eventMonitor.listeners.length; i++) {
                if (msg.eventName === eventMonitor.listeners[i]) {
                    eventAction = "listen";
                    break;
                }
            }

            if (!eventAction) {
                eventAction = "override";
            }

            // Print to appropriate div
            appendTextToDiv(eventAction, msg.eventName.toUpperCase() + " fired at " + currentTime);

            // Update widget state display
            updateWidgetState();

            if (eventAction === "override") {
                var continueEvent = confirm("Event overridden.  Would you like to close this widget?");
                if (continueEvent) {
                    // remove listener override to prevent looping
                    eventMonitor.widgetState.removeStateEventOverrides({
                        events: ['beforeclose'],
                        callback: function () {
                            // close widget in callback
                            eventMonitor.widgetState.closeWidget();
                        }
                    });
                } else {
                    var removeOverride = confirm("Would you like to remove this override?");
                    if (removeOverride) {
                        // remove listener override to prevent looping
                        removeStateEvent("override", msg.eventName);
                    }
                }
            }

            return true;
        }

        owfdojo.addOnLoad(init);
        owfdojo.addOnLoad(onUnload);
    </script>
</head>

<body style="background-color: white;">
<!-- INSERT FORM TO CHOOSE EVENTS -->
<form>
    Event:
    <select id="stateEvent" name="stateEvent" style="width: 150px;">
    </select>
    &nbsp;&nbsp;&nbsp;
    <select id="eventType" name="eventType">
        <option value="listen">listen</option>
        <option value="override">override</option>
    </select>
    &nbsp;&nbsp;&nbsp;
    <input type="button" value="Register" onClick="addStateEvent()"/>
    <br/><br/>
    Monitored Events:
    <select id="monitoredEvents" name="monitoredEvents" style="width: 150px;">
    </select>
    <input type="button" value="Unregister" onClick="removeStateEvent('listen')"/>
    <br/><br/>
    Overridden Events:
    <select id="overriddenEvents" name="overriddenEvents" style="width: 150px;">
    </select>
    <input type="button" value="Unregister" onClick="removeStateEvent('override')"/>
    <br/><br/>
</form>

<hr>
<b><u>Last Reported State</u>:</b>

<div id="currentState"></div>
<hr>

<div id="listen"><b><u>Listener Events</u>:</b></div>
<hr>

<div id="override"><b><u>Override Events</u>:</b></div>
</body>
</html>

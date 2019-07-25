document.addEventListener("DOMContentLoaded", function() {
    OWF.ready(start);
});

function start() {
    updateClock();
    setInterval(updateClock, 1000);

    const msg = "Running in OWF: " + (OWF.Util.isRunningInOWF() ? "Yes" : "No");

    document.getElementById("message-panel").innerHTML = msg;
    document.getElementById("message-panel").style.display = "block";
}

function updateClock() {
    // Format the time portion of the current date
    const timeString = new Date().toLocaleTimeString();

    // Update the time display
    document.getElementById("clock").firstChild.nodeValue = timeString;

    // tag::publish[]
    OWF.Eventing.publish("ClockChannel", timeString);
    // end::publish[]
}

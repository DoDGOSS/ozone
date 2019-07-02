// tag::onload[]
document.addEventListener("DOMContentLoaded", function() {
    OWF.ready(start);
});
// end::onload[]

function start() {
    document.getElementById("currentTime").innerHTML = new Date();

    let channelToUse = "ClockChannel";

    const launchConfig = OWF.Launcher.getLaunchData();

    // No launch configuration; use the default channel
    if (!launchConfig) {
        document.getElementById("error").innerHTML = "Widget was launched manually";
        document.getElementById("tracker-error-panel").style.display = "block";
    }

    // Got the launch configuration; use the dynamically specified channel
    else {
        // Parse the configuration
        const launchConfigJson = JSON.parse(launchConfig);
        channelToUse = launchConfigJson.channel;

        // Hide the error panel
        document.getElementById("tracker-error-panel").style.display = "none";
    }

    // Update the displayed channel
    document.getElementById("channelName").innerHTML = channelToUse;

    // Subscribe to the channel using the Eventing API
    OWF.Eventing.subscribe(channelToUse, this.update);
}

/**
 * The function called every time a message is received on the eventing channel
 */
function update(sender, msg) {
    let count = parseInt(document.getElementById("minutesOnline").innerHTML);
    count = count + 1;
    document.getElementById("minutesOnline").innerHTML = count;
    document.getElementById("currentTime").innerHTML = msg;
}

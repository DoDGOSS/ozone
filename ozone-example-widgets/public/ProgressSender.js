document.addEventListener("DOMContentLoaded", function() {
    if (OWF.Util.isRunningInOWF()) {
        OWF.ready(main);
    } else {
        console.warn("Not running in OWF.");
    }
});

let progress = 0;

function main() {
    OWF.notifyWidgetReady();

    setInterval(incrementProgress, 1000);
}

function incrementProgress() {
    progress = (progress + 1) % 100;

    const elem = document.getElementById("progress");
    elem.innerText = progress.toFixed(0);
}

function sendProgress() {
    OWF.Intents.startActivity(
        {
            action: "progress",
            dataType: "application/json"
        },
        progress,
        function(dest) {
            // no-op
        }
    );
}

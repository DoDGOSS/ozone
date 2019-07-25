document.addEventListener("DOMContentLoaded", function() {
    if (OWF.Util.isRunningInOWF()) {
        OWF.ready(main);
    } else {
        console.warn("Not running in OWF.");
    }
});

function main() {
    setProgress(0);
    registerReceiveIntent();

    OWF.notifyWidgetReady();
}

function setProgress(progress) {
    const elem = document.getElementById("progress");
    elem.innerText = progress.toFixed(0);
}

function registerReceiveIntent() {
    OWF.Intents.receive(
        {
            action: "progress",
            dataType: "application/json"
        },
        function(sender, intent, data) {
            setProgress(data);
        }
    );
}

document.addEventListener("DOMContentLoaded", function() {
    if (OWF.Util.isRunningInOWF()) {
        OWF.ready(main);
    } else {
        console.warn("Not running in OWF.");
    }
});

function main() {
    OWF.notifyWidgetReady();
}


function sendLocation() {
    const url = 'http://api.open-notify.org/iss-now.json';
    axios.get(url).then(data=> OWF.Intents.startActivity(
        {
            action: "iss",
            dataType: "application/json"
        },
        // progress,
        {
            lat: data.data.iss_position.latitude,
            long: data.data.iss_position.longitude
        },
        function(dest) {
            // no-op
        }
    )).catch(err=>console.log(err))
}

